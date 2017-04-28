package com.bosssoft.einvoice.billcheck.front.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bosssoft.einvoice.billcheck.basic.myannotation.RefreshCsrfToken;
import com.bosssoft.einvoice.billcheck.basic.myannotation.VerifyCsrfToken;
import com.bosssoft.einvoice.billcheck.pub.util.HttpUtil;
import com.bosssoft.einvoice.billcheck.pub.util.Tools;
import com.bosssoft.einvoice.billcheck.pub.util.WeixinConstants;
import com.bs.eips.individualarchive.page.Pager;
import com.bs.eips.individualarchive.page.PagerQueryParam;
import com.bs.eips.individualarchive.service.IndividualEIArchivePageService;
import com.bs.eips.individualarchive.service.IndividualEIArchiveService;
import com.bs.eips.user.service.UserService;
import com.google.gson.Gson;

import net.sf.ezmorph.bean.MorphDynaBean;
import net.sf.json.JSONObject;

/**
 * <br>Title:NLoginController.
 * <br>Description:Controller层（不包含票据检验相关）
 * <br>Author:Lyy
 * <br>Date:2017年4月21日
 */
@Controller
@Scope("prototype")
public class NLoginController {
  //新建logger
  private static Logger log = LogManager.getLogger(NLoginController.class);

  @Autowired
  private UserService eipsUserService;

  @Autowired
  private IndividualEIArchivePageService individualEiArchivePageService;

  @Autowired
  private IndividualEIArchiveService individualEiArchiveService;

  /**
   * 
   * <br>Description:前台用户注册.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param mobilePhone 手机号
   * @param passWord 密码
   * @param realName 真实姓名
   * @param authCode 验证码
   * @param request HttpServletRequest
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/register", method = RequestMethod.POST,
    produces = { "application/text;charset=UTF-8" })
  @ResponseBody
  public String register(String mobilePhone, String passWord, String realName, String authCode,
    HttpServletRequest request) {
    // 随机生成16位字符串用户名
    final String userName = getRandomName(16);
    String regResult = "";
    HttpSession session = request.getSession();
    try {
      // 如果session中有openid，先进行微信注册
      String openid = (String) session.getAttribute("openid");
      if (!Tools.isNullStr(openid)) {
        eipsUserService.registerChannel("wx", openid, mobilePhone, authCode, realName);
      }

      // WJY 用户注册
      String userRegisterResult = eipsUserService.register(userName, mobilePhone, passWord, authCode,
        realName);
      JSONObject jsonObject = JSONObject.fromObject(userRegisterResult);
      Map<String, Object> userRegisterMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

      // 如果注册失败，填写失败信息，返回
      if (userRegisterMap.get("success").equals(false)) {
        regResult = (String) userRegisterMap.get("errmsg");
        return regResult;
      }

      // 如果注册成功，登录
      String loginInfo = eipsUserService.login(userName, passWord, "");
      jsonObject = JSONObject.fromObject(loginInfo);
      Map<String, Object> loginInfoMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

      if (loginInfoMap.get("success").equals(false)) {
        String loginResult = (String) loginInfoMap.get("errmsg");
        return loginResult;
      }
      loginSuccess(request, loginInfoMap);
      // 个人用户票据重新归档
      String extraInfo = realName;
      String jsonParam = "{\"userIdentities\":[{\"userIdentity\":\"" + mobilePhone
        + "\", \"userIdentityType\":\"1\"}],\"extraInfo\":\"" + extraInfo + "\"}";
      try {
        individualEiArchiveService.merge((String) request.getSession().getAttribute("uid"), jsonParam);
      } catch (Exception e) {
        e.printStackTrace();
      }
      return null;
    } catch (Exception e) {
      return "注册失败，请重试！";
    }
  }

  /**
   * 
   * <br>Description:wx用户登陆后完善用户信息.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param passWord 密码
   * @param realName 真实姓名
   * @param randomCode 随机码
   * @param request HttpServletRequest
   * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/improve", method = RequestMethod.POST,
    produces = { "application/text;charset=UTF-8" })
  @ResponseBody
  @VerifyCsrfToken
  @RefreshCsrfToken
  public String improve(String passWord, String realName, String randomCode, HttpServletRequest request) {
    // WJY 修改用户信息

    String regResult = "";
    HttpSession session = request.getSession();
    final String uid = (String) session.getAttribute("uid");
    final String userName = getRandomName(16);
    String imageId = (String) session.getAttribute("imageid");
    // 升级token
    String toakenJson = eipsUserService.updateSessionTokenPic(imageId, randomCode, uid);
    JSONObject jsonObject = JSONObject.fromObject(toakenJson);
    Map<String, Object> writeTokenMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (writeTokenMap.get("success").equals(false)) {
      regResult = "验证码输入错误";
    } else {
      MorphDynaBean details = (MorphDynaBean) writeTokenMap.get("data");
      String sessionToken = (String) details.get("session_token");
      session.setAttribute("session_token", sessionToken);
      // 升级token成功后更新用户信息
      if (updateUserNameNamePassword(uid, realName, userName, passWord, request)) {
        return null;
      } else {
        regResult = "更新失败，请重试！";
      }
    }
    // 个人用户票据重新归档
    String extraInfo = realName;
    String jsonParam = "{\"userIdentities\":[{\"userIdentity\":\"" + session.getAttribute("mobilePhone")
      + "\", \"userIdentityType\":\"1\"}],\"extraInfo\":\"" + extraInfo + "\"}";
    try {
      individualEiArchiveService.merge((String) session.getAttribute("uid"), jsonParam);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return regResult;
  }

  /**
   * 
   * <br>Description:发送短信验证码.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param mobilePhone 手机号
   * @return String
   * @throws Exception 有异常向上层抛出
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/sendMessage", method = RequestMethod.POST)
  @ResponseBody
  public String sendMessage(String mobilePhone) throws Exception {
    // WJY 发送验证码
    System.out.println(mobilePhone.toString());
    String smsSuccess = eipsUserService.phoneVerifyCode(mobilePhone);
    // {data={"session_token":"cNk349PpA1M8kha2rw"}, success=true}
    JSONObject jsonObject = JSONObject.fromObject(smsSuccess);
    Map<String, Object> messageMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

    if (messageMap.get("success").equals(true)) {
      return "0";
    } else {
      return "1";
    }
  }

  /**
   * 
   * <br>Description:发送短信验证码byuid.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @return String
   * @throws Exception Exception
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/sendMessageByUid", method = RequestMethod.POST)
  @ResponseBody
  public String sendMessageByUid(HttpServletRequest request) throws Exception {
    // WJY 发送验证码
    HttpSession session = request.getSession();
    String uid = (String) session.getAttribute("uid");
    String smsSuccess = eipsUserService.verifyCode(uid);
    JSONObject jsonObject = JSONObject.fromObject(smsSuccess);
    Map<String, Object> messageMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

    if (messageMap.get("success").equals(true)) {
      return "0";
    } else {
      return "1";
    }
  }

  /**
   * 
   * <br>Description:前台 用户登录.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param mobilePhone 手机号
   * @param passWord 登录密码
    * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/login", method = RequestMethod.POST)
  @ResponseBody
  public String login(String mobilePhone, String passWord, HttpServletRequest request) {
    String ret = "0" + "$";
    if (Tools.isNullStr(mobilePhone) && Tools.isNullStr(passWord)) {
      ret = "请输入手机号和密码" + "$";
    } else if (Tools.isNullStr(mobilePhone)) {
      ret = "请输入手机号" + "$";
    } else if (Tools.isNullStr(passWord)) {
      ret = "请输入密码" + "$";
    }
    if (!ret.equals("0" + "$")) {
      return ret;
    }

    try {
      String loginInfo;
      // WJY 用户登录
      if (isChinaPhoneLegal(mobilePhone)) {
        loginInfo = eipsUserService.login("", passWord, mobilePhone);
      } else {
        loginInfo = eipsUserService.login(mobilePhone, passWord, "");
      }

      JSONObject jsonObject = JSONObject.fromObject(loginInfo);
      Map<String, Object> loginInfoMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

      if (loginInfoMap.get("success").equals(false)) {
        String loginResult = (String) loginInfoMap.get("errmsg");
        ret = loginResult + "$";
        return ret;
      }
      loginSuccess(request, loginInfoMap);
      return ret;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * 
   * <br>Description:大陆手机号码11位数，匹配格式：前三位固定格式+后8位任意数 此方法中前三位格式有： 13+任意数 15+除4的任意数 18+除1和4的任意数
   * 17+除9的任意数 147.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param str 手机号
   * @return boolean
   * @throws PatternSyntaxException PatternSyntax异常
   */
  public static boolean isChinaPhoneLegal(String str) throws PatternSyntaxException {
    String regExp = "^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\\d{8}$";
    Pattern pt = Pattern.compile(regExp);
    Matcher mc = pt.matcher(str);
    return mc.matches();
  }

  /**
   * 
   * <br>Description:退出登录.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param request HttpServletRequest 
   * @return String
   */
  @RequestMapping(value = "user/loginOut", method = RequestMethod.POST)
  @ResponseBody
  public String loginOut(HttpServletRequest request) {
    Enumeration<?> er = request.getSession().getAttributeNames();
    while (er.hasMoreElements()) {
      String sessionName = (String) er.nextElement();
      request.getSession().removeAttribute(sessionName);
    }
    request.getSession().invalidate();

    return "success";
  }

  /**
   * 
   * <br>Description:忘记密码功能第三部：重置密码.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param mobilePhone 手机号
   * @param authCode 验证码
   * @param passWord 密码
   * @param request HttpServletRequest
   * @param response HttpServletResponse
   * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/resetPwd", method = RequestMethod.POST)
  @ResponseBody
  @VerifyCsrfToken
  @RefreshCsrfToken
  public String resetPwd(String mobilePhone, String authCode, String passWord, HttpServletRequest request,
    HttpServletResponse response) {

    String resetJson = eipsUserService.resetPassword(mobilePhone, passWord, "", authCode);
    JSONObject jsonObject = JSONObject.fromObject(resetJson);
    Map<String, Object> resetMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

    if (resetMap.get("success").equals(false)) {
      return "0";
    } else {
      return "1";
    }
  }

  /**
   * 
   * <br>Description:验证原密码是否正确.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param passWord 密码
   * @param userName 用户名
   * @param request HttpServletRequest
   * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/isPwd", method = RequestMethod.POST)
  @ResponseBody
  public String isPwd(String passWord, String userName, HttpServletRequest request) {

    try {
      String loginInfo;
      // WJY 用户登录
      /*
       * String userName = (String)
       * request.getSession().getAttribute("username");
       */
      if (isChinaPhoneLegal(userName)) {
        loginInfo = eipsUserService.login("", passWord, userName);
      } else {
        loginInfo = eipsUserService.login(userName, passWord, "");
      }

      JSONObject jsonObject = JSONObject.fromObject(loginInfo);
      Map<String, Object> loginInfoMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

      if (loginInfoMap.get("success").equals(false)) {
        return "0";
      }
      return "1";
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * 
   * <br>Description:修改用户信息.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param uid uid
   * @param realName 真实姓名
   * @param mobilePhone 手机号
   * @param relateName 关联人
   * @param authCode 验证码
   * @param randomCode 随机码
   * @param request HttpServletRequest
   * @return String
   */
  @RequestMapping(value = "user/updateRegUser", method = RequestMethod.POST)
  @ResponseBody
  @VerifyCsrfToken
  @RefreshCsrfToken
  public String updateRegUser(String uid, String realName, String mobilePhone, String relateName,
    String authCode, String randomCode, HttpServletRequest request) {
    // WJY 修改用户信息
    String ret = "0";
    HttpSession session = request.getSession();
    final String imageId = (String) session.getAttribute("imageid");
    // 图片升级token
    boolean tokenSuccess;
    if (!Tools.isNullStr(randomCode)) {
      tokenSuccess = updateSessionTokenByPic(request, imageId, randomCode, uid);
      if (!tokenSuccess) {
        ret = "2";
        return ret;
      }
    }
    // 修改手机
    String oldPhone = (String) session.getAttribute("phone");
    boolean rebindPhoneSuccess = true;
    if (!Tools.isNullStr(authCode) && !Tools.isNullStr(oldPhone) && !oldPhone.equals(mobilePhone)) {
      rebindPhoneSuccess = updatePhone(request, mobilePhone, authCode, uid);
    }
    // 修改真实姓名
    String oldName = (String) session.getAttribute("name");
    boolean changeNameSuccess = true;
    if (!Tools.isNullStr(oldName) && !Tools.isNullStr(realName) && !oldName.equals(realName)) {
      changeNameSuccess = updateName(uid, realName, request);
    }
    // 修改关联姓名
    String oldRelateName = (String) session.getAttribute("relateName");
    boolean changReLateSuccess = true;
    if ((Tools.isNullStr(oldRelateName) && !Tools.isNullStr(relateName))
      || (!Tools.isNullStr(oldRelateName) && !oldRelateName.equals(relateName))) {
      changReLateSuccess = updateRelateName(request, uid, relateName);
    }

    if (rebindPhoneSuccess && changeNameSuccess && changReLateSuccess) {
      // 个人用户票据重新归档

      /**
       * 合并.
       * 
       * @param userId
       *            用户ID
       * @param jsonStr
       *            JSON格式的字符串，主要是用户的合并信息，示例如下： { "userIdentities" : [ {
       *            "userIdentity":"13988888888", "userIdentityType":"1" }
       *            ], "extraInfo" : "张三, 李四"
       *
       *            }
       *
       */
      String extraInfo = realName + relateName;
      String jsonParam = "{\"userIdentities\":[{\"userIdentity\":\"" + mobilePhone
        + "\", \"userIdentityType\":\"1\"}],\"extraInfo\":\"" + extraInfo + "\"}";
      try {
        individualEiArchiveService.merge(uid, jsonParam);
        return ret;
      } catch (Exception e) {
        e.printStackTrace();
      }

    } else {
      ret = "1";
      return ret;
    }
    return null;
  }

  /**
   * 获取六位随机数函数.
   * 函数名称:getAuthCode
   * </p>
   * <p>
   * 功能说明:
   * </p>
   * <p>
   * 参数说明:
   * </p>
   *
   * @return String
   * @date 2014-12-2
   * @author By：Renekton
   */
  public String getAuthCode() {
    return String.valueOf((int) ((Math.random() * 9 + 1) * 100000));
  }

  /* *//**
       * 忘记密码第二步 检查发送邮件或者手机的验证码的正确性.
       * <p>
       * 函数名称:checkAuthCode
       * </p>
       * <p>
       * 功能说明:
       * </p>
       * <p>
       * 参数说明:
       * </p>
       *
       * @date 2014-12-6
       * @author By：Renekton
       *//*
         @SuppressWarnings({ "unchecked", "rawtypes" })
         public void checkAuthCode(HttpServletRequest request) {
         String code = request.getParameter("code");
         String mobile = request.getParameter("mobile");
         Map maps = new HashMap();
         maps.put("code", code);
         maps.put("mobile", mobile);
         
         
         * try { String str = JSONUtil.serialize(maps);
         * response.getWriter().print(str); } catch (IOException e) {
         * e.printStackTrace(); } catch (JSONException e) { e.printStackTrace();
         * }
         
         }*/

  @SuppressWarnings("unchecked")
  private boolean updateSessionTokenByPic(HttpServletRequest request, String imageId, String picCode,
    String uid) {
    boolean success = true;
    String toakenJson = eipsUserService.updateSessionTokenPic(imageId, picCode, uid);
    JSONObject jsonObject = JSONObject.fromObject(toakenJson);
    Map<String, Object> toakenMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (toakenMap.get("success").equals(false)) {
      return !success;
    }

    MorphDynaBean details = (MorphDynaBean) toakenMap.get("data");
    String sessionToken = (String) details.get("session_token");
    request.getSession().setAttribute("session_token", sessionToken);
    return success;
  }

  @SuppressWarnings("unchecked")
  private boolean updatePhone(HttpServletRequest request, String phone, String code, String uid) {
    boolean success = true;
    String writeTokenJson = eipsUserService.updateSessionTokenPhone(phone, code, uid);

    JSONObject jsonObject = JSONObject.fromObject(writeTokenJson);
    Map<String, Object> writeTokenMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);

    if (writeTokenMap.get("success").equals(false)) {
      return !success;
    }

    MorphDynaBean sessionDetails = (MorphDynaBean) writeTokenMap.get("data");
    String writeSession = (String) sessionDetails.get("session_token");
    request.getSession().setAttribute("session_token", writeSession);
    String rebindPhoneJson = eipsUserService.rebindPhone(uid, phone, code, writeSession);
    jsonObject = JSONObject.fromObject(rebindPhoneJson);
    Map<String, Object> rebindPhoneMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (rebindPhoneMap.get("success").equals(false)) {
      return !success;
    } else {
      request.getSession().setAttribute("phone", phone);
      // 个人用户票据重新归档
      String jsonParam = "[{\"userIdentity\":\"" + phone + "\", \"userIdentityType\":\"1\"}]";
      try {
        individualEiArchiveService.merge(uid, jsonParam);
      } catch (Exception e) {
        e.printStackTrace();
      }
      return success;
    }
  }

  @SuppressWarnings("unchecked")
  private boolean updateName(String uid, String name, HttpServletRequest request) {
    boolean success = true;
    String sessionToken = (String) request.getSession().getAttribute("session_token");
    String userJson = eipsUserService.modifyUserInfo(uid, name, "", sessionToken, "");
    JSONObject jsonObject = JSONObject.fromObject(userJson);
    Map<String, Object> userMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (userMap.get("success").equals(false)) {
      return !success;
    }
    request.getSession().setAttribute("name", name);
    return success;

  }

  @SuppressWarnings("unchecked")
  private boolean updateUserNameNamePassword(String uid, String name, String username, String password,
    HttpServletRequest request) {
    boolean success = true;
    String sessionToken = (String) request.getSession().getAttribute("session_token");
    String userJson = eipsUserService.modifyUserInfo(uid, username, password, sessionToken, name);
    JSONObject jsonObject = JSONObject.fromObject(userJson);
    Map<String, Object> userMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (userMap.get("success").equals(false)) {
      return !success;
    }
    request.getSession().setAttribute("name", name);
    request.getSession().setAttribute("username", username);
    return success;

  }

  @SuppressWarnings("unchecked")
  private boolean updateRelateName(HttpServletRequest request, String uid, String relateName) {
    boolean success = true;
    String version = "0";
    String sessionToken = (String) request.getSession().getAttribute("session_token");

    String relateNameJson = eipsUserService.queryUserExtraInfo(uid, sessionToken);
    JSONObject jsonObject = JSONObject.fromObject(relateNameJson);
    Map<String, Object> relateNameMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (relateNameMap.get("success").equals(true)) {
      MorphDynaBean relateNameDetails = (MorphDynaBean) relateNameMap.get("data");
      version = String.valueOf(relateNameDetails.get("version"));
    }

    relateNameJson = eipsUserService.modifyUserExtraInfo(uid, sessionToken, version, ",", relateName);
    jsonObject = JSONObject.fromObject(relateNameJson);
    relateNameMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (relateNameMap.get("success").equals(false)) {
      return !success;
    }
    request.getSession().setAttribute("relateName", relateName);
    return success;
  }

  /**
   * 
   * <br>Description:修改用户密码.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param passWord 密码
   * @param randomCode 验证码
   * @param request HttpServletRequest
   * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/updateUserPwd", method = RequestMethod.POST)
  @ResponseBody
  @VerifyCsrfToken
  @RefreshCsrfToken
  public String updateUserPwd(String passWord, String randomCode, HttpServletRequest request) {
    // WJY 修改密码
    String ret = "0";
    HttpSession session = request.getSession();
    String imageId = (String) session.getAttribute("imageid");
    String uid = (String) session.getAttribute("uid");
    String userName = (String) session.getAttribute("userName");

    String toakenJson = eipsUserService.updateSessionTokenPic(imageId, randomCode, uid);
    JSONObject jsonObject = JSONObject.fromObject(toakenJson);
    Map<String, Object> toakenMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (toakenMap.get("success").equals(false)) {
      return "1";
    } else {
      MorphDynaBean details = (MorphDynaBean) toakenMap.get("data");
      String sessionToken = (String) details.get("session_token");
      String userJson = eipsUserService.modifyUserInfo(uid, userName, passWord, sessionToken, "");
      jsonObject = JSONObject.fromObject(userJson);
      Map<String, Object> userMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
      if (userMap.get("success").equals(false)) {
        return "1";
      }
      return ret;
    }
  }

  /**
   * 
   * <br>Description:历史票据分页.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param pageNow String
   * @param userId String
   * @param pageSize String
   * @param beginDate String
   * @param endDate String
   * @param timeFlag String
   * @param endPos Strings
   * @param request HttpServletRequest
   * @return String
   */
  @RequestMapping(value = "user/pageOfBill", method = RequestMethod.POST)
  @ResponseBody
  public String pageOfBill(String pageNow, String userId, String pageSize, String beginDate, String endDate,
    String timeFlag, String endPos, HttpServletRequest request) {
    // WJY 分页
    String today = Tools.getDate2();
    beginDate = beginDate.replace("-", "");
    endDate = endDate.replace("-", "");
    PagerQueryParam pagerQueryParam = new PagerQueryParam();
    pagerQueryParam.setUserID(userId);
    pagerQueryParam.setPageSize(Long.valueOf(pageSize));

    if (!timeFlag.equals("4")) {
      String start;
      if (timeFlag.equals("1")) {
        start = Tools.getDateBeforeN(90);
      } else if (timeFlag.equals("2")) {
        start = Tools.getDateBeforeN(180);
      } else {
        start = today.substring(0, 4) + "0101";
      }
      pagerQueryParam.setStartTime(start);
      pagerQueryParam.setEndTime(today);
    } else {
      pagerQueryParam.setStartTime(beginDate);
      pagerQueryParam.setEndTime(endDate);
    }
    if (Tools.isNullStr(endPos) || pageNow.equals("1")) {
      pagerQueryParam.setStartPos("0");
    } else {
      pagerQueryParam.setStartPos(endPos);
    }
    Pager page = individualEiArchivePageService.queryPage(pagerQueryParam);
    Map<String, Object> pagingMap = new HashMap<String, Object>();
    Gson gson;
    try {
      pagingMap.put("totalCount", page.getTotalCount());
      pagingMap.put("totalPageNo", page.getTotalPageNo());
      pagingMap.put("pageSize", page.getPageSize());
      pagingMap.put("startPos", page.getStartPos());
      pagingMap.put("endPos", page.getEndPos());
      pagingMap.put("billList", page.getList());

      String str = "";
      if (0 < Integer.parseInt(page.getTotalCount())) {
        gson = new Gson();
        str = gson.toJson(pagingMap);
      }
      System.out.println(str.toString());
      return str;
    } catch (Exception e) {
      log.error(e);
    }
    return null;
  }

  /**
   * 
   * <br>Description:返回获取二维码的必须参数.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param request HttpServletRequest
   * @return String
   */
  @RequestMapping(value = "user/getQrcodeInfo", method = RequestMethod.POST)
  @ResponseBody
  public String getQrcodeInfo(HttpServletRequest request) {
    String state = getUuid();
    String appid = WeixinConstants.APPID;
    String redirectUri;
    HttpSession session = request.getSession();
    session.setAttribute("state", state);
    try {
      redirectUri = URLEncoder.encode(WeixinConstants.CALLBACKLOGIN, "UTF-8");
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeException("编码失败, 编码参数:" + WeixinConstants.CALLBACKLOGIN);
    }
    String scope = "snsapi_login";
    String responseType = "code";// js方式获取二维码, 并用到本参数
    Map<String, String> hm = new HashMap<String, String>();
    hm.put("appid", appid);
    hm.put("scope", scope);
    hm.put("redirect_uri", redirectUri);
    hm.put("state", state);
    hm.put("response_type", responseType);
    JSONObject jsonObject = JSONObject.fromObject(hm);
    return jsonObject.toString();
  }

  /**
   * 
   * <br>Description:callback url 返回的内容，包含code和state.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param request HttpServletRequest
   * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "user/loginByUser", method = RequestMethod.POST)
  @ResponseBody
  public String loginByUser(HttpServletRequest request) {
    String code = request.getParameter("code");
    if (code == null) {
      System.out.println("用户已取消此次授权登录, 可再次扫描登录");
      return "relogin";
    }
    // String sessionState = (String)
    // request.getSession().getAttribute("state");
    // if(sessionState == null || sessionState.length()==0 ||
    // !sessionState.equals(state)){
    // throw new RuntimeException("该请求可能存在风险!");
    // }

    // 1. 获取access_token, openid, refresh_token, expires_in
    Map<String, String> jsonMap;
    try {
      jsonMap = this.getTokenInfo(code);
    } catch (RuntimeException e) {
      e.printStackTrace();
      return "relogin";
    }
    String accessToken = jsonMap.get("access_token");
    String openid = jsonMap.get("openid");
    // 2. 查询用户信息
    String jsonStringUser = getUserInfo(accessToken, openid);
    if (jsonStringUser == null) {
      return "relogin";
    }
    JSONObject jsonObject = JSONObject.fromObject(jsonStringUser);
    String unionId = (String) jsonObject.get("unionid");
    String nickname = (String) jsonObject.get("nickname");
    request.getSession().setAttribute("nickname", nickname);
    String wxloginResult = eipsUserService.loginChannel("wx", unionId);
    JSONObject wxloginObject = JSONObject.fromObject(wxloginResult);
    Map<String, Object> loginInfoMap = (Map<String, Object>) JSONObject.toBean(wxloginObject, Map.class);

    if (loginInfoMap.get("success").equals(true)) {
      MorphDynaBean details = (MorphDynaBean) loginInfoMap.get("data");
      if (details.toString().contains("userName=")) {
        loginSuccess(request, loginInfoMap);
        return "success";
      }
      wxloginSuccess(loginInfoMap, request);
      return "improve";
    }
    request.getSession().setAttribute("openId", unionId);
    return "error";
  }

  /**
   * 
   * <br>Description:判断输入的手机验证码是否正确.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param request HttpServletRequest
   * @return String
   */
  @ResponseBody
  public String isAuthCode(HttpServletRequest request) {
    String authCode = request.getParameter("authCode");
    String mobile = request.getParameter("mobile");
    String authCodeStr = (String) request.getSession().getAttribute("authCode");// 获取session中手机和验证码
    String[] authCodeArray = authCodeStr.split(",");
    String smobile = authCodeArray[0];
    String sauthCode = authCodeArray[1];
    String ret = "0";
    if (!mobile.equals(smobile)) {
      ret = "1";
    } else {
      if (!authCode.equals(sauthCode)) {
        ret = "1";
      }
    }
    return ret;
  }

  /**
   * 
   * <br>Description:校验手机验证码.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param request HttpServletRequest
   * @param response HttpServletResponse
   */
  public void checkMobileYzm(HttpServletRequest request, HttpServletResponse response) {
    String mobileNo = request.getParameter("mobilePhone");
    String teleyzm = request.getParameter("teleyzm");
    String authCode = (String) request.getSession().getAttribute("authCode");
    if (!Tools.isNullStr(authCode)) {
      if (!authCode.equals(mobileNo + "," + teleyzm)) {
        try {
          response.getWriter().print("0");
        } catch (IOException e) {
          e.printStackTrace();
        }
      } else {
        try {
          response.getWriter().print("1");
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    } else {
      try {
        response.getWriter().print("0");
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  @SuppressWarnings("unchecked")
  private Map<String, String> getTokenInfo(String code) {
    String accessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?" + "appid=%s&" + "secret=%s&"
      + "code=%s&" + "grant_type=authorization_code";
    accessTokenUrl = String.format(accessTokenUrl, WeixinConstants.APPID, WeixinConstants.APPSECRET, code);
    JSONObject jsonObject = HttpUtil.httpsRequest(accessTokenUrl, "POST", null);
    HttpUtil.checkResult(jsonObject, "首次获取token失败 ");
    Map<String, String> jsonMap = (Map<String, String>) jsonObject;
    if (jsonMap.get("access_token") == null || jsonMap.get("openid") == null) {
      throw new RuntimeException("首次获取access_token, openid失败. 参数code:" + code);
    }
    return jsonMap;
  }

  private String getUserInfo(String accessToken, String openId) {

    String userInfoUrl = "https://api.weixin.qq.com/sns/userinfo?" + "access_token=%s&" + "openid=%s";
    userInfoUrl = String.format(userInfoUrl, accessToken, openId);
    JSONObject jsonObject = HttpUtil.httpsRequest(userInfoUrl, "POST", null);
    String jsonString = HttpUtil.checkResult(jsonObject, "获取用户基本信息失败 ");
    return jsonString;
  }

  @SuppressWarnings("unchecked")
  private void loginSuccess(HttpServletRequest request, Map<String, Object> loginInfoMap) {
    // 如果登录成功
    HttpSession session = request.getSession();
    // 首先将原session中的数据转移至一临时map中
    Map<String, Object> tempMap = new HashMap<String, Object>();
    Enumeration<String> sessionNames = session.getAttributeNames();
    while (sessionNames.hasMoreElements()) {
      String sessionName = sessionNames.nextElement();
      tempMap.put(sessionName, session.getAttribute(sessionName));
    }
    // 注销原session，为的是重置sessionId
    session.invalidate();
    // 将临时map中的数据转移至新session
    session = request.getSession();
    for (Map.Entry<String, Object> entry : tempMap.entrySet()) {
      session.setAttribute(entry.getKey(), entry.getValue());
    }
    MorphDynaBean details = (MorphDynaBean) loginInfoMap.get("data");
    String relateNameJson = eipsUserService.queryUserExtraInfo((String) details.get("uid"),
      (String) details.get("session_token"));
    JSONObject jsonObject = JSONObject.fromObject(relateNameJson);
    // "userName":"realname","mobilePhone":"131xxxx1657","session_token":
    // "c4unf5d6W1M8khaCro","uid":"c4unOAl6W1M8kha1","userName":"liqw7"
    session.setAttribute("uid", details.get("uid"));
    session.setAttribute("session_token", details.get("session_token"));
    session.setAttribute("phone", details.get("phone"));
    session.setAttribute("name", details.get("name"));
    session.setAttribute("username", details.get("username"));
    Map<String, Object> relateNameMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (relateNameMap.get("success").equals(true)) {
      MorphDynaBean relateNameDetails = (MorphDynaBean) relateNameMap.get("data");
      session.setAttribute("relateName", relateNameDetails.get("info"));
    }
  }

  private void wxloginSuccess(Map<String, Object> loginInfoMap, HttpServletRequest request) {
    // 如果登录成功
    HttpSession session = request.getSession();
    // 首先将原session中的数据转移至一临时map中
    Map<String, Object> tempMap = new HashMap<String, Object>();
    Enumeration<String> sessionNames = session.getAttributeNames();
    while (sessionNames.hasMoreElements()) {
      String sessionName = sessionNames.nextElement();
      tempMap.put(sessionName, session.getAttribute(sessionName));
    }
    // 注销原session，为的是重置sessionId
    session.invalidate();
    // 将临时map中的数据转移至新session
    session = request.getSession();
    for (Map.Entry<String, Object> entry : tempMap.entrySet()) {
      session.setAttribute(entry.getKey(), entry.getValue());
    }
    MorphDynaBean details = (MorphDynaBean) loginInfoMap.get("data");
    session.setAttribute("uid", details.get("uid"));
    session.setAttribute("session_token", details.get("session_token"));
    session.setAttribute("mobilePhone", details.get("mobilePhone"));
    session.setAttribute("userName", details.get("userName"));
  }

  /**
   * 
   * <br>
   * Description:随机产生用户名. <br>
   * Author:Lyy <br>
   * Date:2017年4月18日
   * 
   * @param nameLength 指定随机用户名长度
   * @return String
   */
  private String getRandomName(int nameLength) {
    Random ranGen = new SecureRandom();
    byte[] aesKey = new byte[nameLength];
    ranGen.nextBytes(aesKey);
    StringBuffer hexString = new StringBuffer();
    for (int i = 0; i < aesKey.length; i++) {
      String hex = Integer.toHexString(0xff & aesKey[i]);
      if (hex.length() == 1) {
        hexString.append("0");
      }
      hexString.append(hex);
    }
    return hexString.toString();
  }

  private String getUuid() {
    return UUID.randomUUID().toString().replace("-", "");
  }

}
