package com.bosssoft.einvoice.billcheck.controller;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bs.eips.sync.service.EInvoiceSyncService;
import com.google.gson.Gson;

import net.sf.json.JSONObject;

/**
 * Title:BillCheckController. <br>
 * Description:票据查验Controller层 <br>
 * Author:Lyy <br>
 * Date:2017年4月14日
 */
@Scope("prototype")
@Controller
public class BillCheckController {

  private static final long serialVersionUID = 3298753817269071371L;

  @Autowired
  private EInvoiceSyncService eleInvoiceSyncService;

  /**
   * 
   * <br>Description:票据查验 (修改) .
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param billCode 票据代码
   * @param billNumber 票据号码
   * @param securityCode 校验码
   * @param code 随机码
   * @param request HttpServletRequest
   * @return String
   */
  @SuppressWarnings("unchecked")
  @RequestMapping(value = "queryBill", method = RequestMethod.POST,
    produces = { "application/text;charset=UTF-8" })
  @ResponseBody
  public String queryBill(String billCode, String billNumber, String securityCode, String code,
    HttpServletRequest request) {
    Map mapresult = new HashMap();

    if (!request.getSession().getAttribute("code").toString().equalsIgnoreCase(code)) {
      mapresult.put("status", 0);
      mapresult.put("msg", "随机码错误！");
    } else {
      try {
        String jsonResult = eleInvoiceSyncService.doSingleSync(billCode, billNumber, securityCode, "IMG");
        JSONObject jsonObject = JSONObject.fromObject(jsonResult);
        Map<String, String> billCheckResult = (Map<String, String>) JSONObject.toBean(jsonObject, Map.class);
        if (billCheckResult.get("status").equals("200")) {
          mapresult.put("status", 1);
          mapresult.put("msg", "查验成功");
        } else {
          mapresult.put("status", 0);
          mapresult.put("msg", billCheckResult.get("message"));
        }

      } catch (Exception e) {
        e.printStackTrace();
        mapresult.put("status", 0);
        mapresult.put("msg", "查验错误！");
      }
    }
    String str = "";
    Gson gson;
    try {
      gson = new Gson();
      str = gson.toJson(mapresult);
      return str;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * 
   * <br>Description:跳转票据图片页面.
   * <br>Author:Lyy (修改)
   * <br>Date:2017年4月24日
   * @param rbillCode 票据代码
   * @param rbillNumber 票据号码
   * @param rsecurityCode 校验码
   * @param request HttpServletRequest
   * @return String
   */
  @RequestMapping(value = "billcheck/toShowBill", method = RequestMethod.POST)
  public String toShowBill(String rbillCode, String rbillNumber, String rsecurityCode,
    HttpServletRequest request) {
    request.setAttribute("EInvoiceCode", rbillCode);
    request.setAttribute("EInvoiceNumber", rbillNumber);
    request.setAttribute("RandomNumber", rsecurityCode);
    return "billcheck/billshow";
  }

  /**
   * 
   * <br>Description:无验证码查验票据.
   * <br>Author:Lyy (修改)
   * <br>Date:2017年4月24日
   * @param billCode 票据代码
   * @param billNumber 票据号码
   * @param securityCode 校验码
   * @param request HttpServletRequest
   * @return String
   */
  @RequestMapping(value = "billcheck/queryBillWithOutCode", method = RequestMethod.POST)
  @ResponseBody
  public String queryBillWithOutCode(String billCode, String billNumber, String securityCode,
    HttpServletRequest request) {
    return billCheck(billCode, billNumber, securityCode, request);
  }

  /**
   * 
   * <br>Description:通过地址直接查验票据.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param version 版本
   * @param eInvoiceCode 票据代码
   * @param eInvoiceNumber 票据号码
   * @param randomNumber 校验码
   * @param request HttpServletRequest
   * @param response HttpServletResponse
   * @return String
   */
  @RequestMapping("einvoice/{Version}.{EInvoiceCode}.{EInvoiceNumber}.{RandomNumber}")
  public String einvoice(@PathVariable("Version") String version,
    @PathVariable("EInvoiceCode") String eInvoiceCode, @PathVariable("EInvoiceNumber") String eInvoiceNumber,
    @PathVariable("RandomNumber") String randomNumber, HttpServletRequest request,
    HttpServletResponse response) {
    request.setAttribute("EInvoiceCode", eInvoiceCode);
    request.setAttribute("EInvoiceNumber", eInvoiceNumber);
    request.setAttribute("RandomNumber", randomNumber);

    return "billcheck/billshow";

  }

  /**
   * 
   * <br>Description:票据查验.
   * <br>Author:Lyy (修改)
   * <br>Date:2017年4月24日
   * @param billCode 票据代码
   * @param billNumber 票据号码
   * @param securityCode 校验码
   * @param request HttpServletRequest
   * @return String
   */
  @SuppressWarnings("unchecked")
  private String billCheck(String billCode, String billNumber, String securityCode,
    HttpServletRequest request) {
    Map mapresult = new HashMap();
    String jsonResult = null;
    Gson gson = null;
    try {
      jsonResult = eleInvoiceSyncService.doSingleSync(billCode, billNumber, securityCode, "IMG");

      JSONObject jsonObject = JSONObject.fromObject(jsonResult);
      Map<String, String> billCheckResult = (Map<String, String>) JSONObject.toBean(jsonObject, Map.class);
      if (billCheckResult.get("status").equals("200")) {
        mapresult.put("status", 1);
        mapresult.put("msg", "查验成功");
      } else {
        mapresult.put("status", 0);
        mapresult.put("msg", "票据电子版还未生成");
      }

      String str = "";
      gson = new Gson();
      str = gson.toJson(mapresult);
      return str;
    } catch (Exception e1) {
      e1.printStackTrace();
      mapresult.put("status", 0);
      mapresult.put("msg", "网络异常");
      String str = "";
      try {
        gson = new Gson();
        str = gson.toJson(mapresult);
        return str;
      } catch (Exception e) {
        e.printStackTrace();
      }
      return null;
    }
    // return success();
  }

  /**
   * 
   * <br>Description:下载票据图片.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param eInvoiceCode 票据代码
   * @param eInvoiceNumber 票据号码
   * @param randomNumber 校验码
   * @param request HttpServletRequest
   * @param response HttpServletResponse
   * @return ResponseEntity
   * @throws Exception 异常抛出
   */
  @RequestMapping("billcheck/downofbill/{EInvoiceCode}.{EInvoiceNumber}.{RandomNumber}")
  public ResponseEntity<byte[]> downofbill(@PathVariable("EInvoiceCode") String eInvoiceCode,
    @PathVariable("EInvoiceNumber") String eInvoiceNumber, @PathVariable("RandomNumber") String randomNumber,
    HttpServletRequest request, HttpServletResponse response) throws Exception {

    ResponseEntity<byte[]> re = null;
    //查验票单
    String jsonResult = null;
    try {
      jsonResult = eleInvoiceSyncService.doSingleSync(eInvoiceCode, eInvoiceNumber, randomNumber, "IMG");
    } catch (Exception e1) {
      e1.printStackTrace();
    }

    JSONObject jsonObject = JSONObject.fromObject(jsonResult);
    Map<String, String> billCheckResult = (Map<String, String>) JSONObject.toBean(jsonObject, Map.class);
    String randomName = getRandomName(16);
    try {
      HttpHeaders headers = new HttpHeaders();
      // String filename=URLEncoder.encode(name, "UTF-8");//为了解决中文名称乱码问题
      String filename = new String(randomName.getBytes("utf-8"), "utf-8") + ".png";
      byte[] pic = com.bs.einvoice.sdk.utils.Base64.decode(billCheckResult.get("data"));
      headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
      // URLEncoder.encode(filename, "UTF-8")
      headers.setContentDispositionFormData("attachment", filename);
      headers.setContentLength(pic.length);
      re = new ResponseEntity<byte[]>(pic, headers, HttpStatus.CREATED);
    } catch (Exception e) {
      e.printStackTrace();
      try {
        request.getRequestDispatcher("/page/front/404.jsp").forward(request, response);
      } catch (ServletException e1) {
        e1.printStackTrace();
      } catch (IOException e1) {
        e1.printStackTrace();
      }
    }
    return re;
  }

  /**
   * 
   * <br>Description:票据展示.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param eInvoiceCode 票据代码
   * @param eInvoiceNumber 票据号码
   * @param randomNumber 校验码
   * @param response HttpServletResponse
   * @return String
   */
  @RequestMapping(value = "billcheck/showBill/{EInvoiceCode}.{EInvoiceNumber}.{RandomNumber}")
  public String showBill(@PathVariable("EInvoiceCode") String eInvoiceCode,
    @PathVariable("EInvoiceNumber") String eInvoiceNumber, @PathVariable("RandomNumber") String randomNumber,
    HttpServletResponse response) {
    // 显示图片
    ServletOutputStream sout = null;
    String jsonResult = null;
    try {
      jsonResult = eleInvoiceSyncService.doSingleSync(eInvoiceCode, eInvoiceNumber, randomNumber, "IMG");
    } catch (Exception e1) {
      e1.printStackTrace();
    }

    JSONObject jsonObject = JSONObject.fromObject(jsonResult);
    Map<String, String> billCheckResult = (Map<String, String>) JSONObject.toBean(jsonObject, Map.class);
    if (billCheckResult.get("status").equals("200")) {
      byte[] pic = com.bs.einvoice.sdk.utils.Base64.decode(billCheckResult.get("data"));
      try {
        sout = response.getOutputStream();
        sout.write(pic);
        sout.flush();
        sout.close();
        sout = null;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return null;

  }

  /**
   * 
   * <br>Description:随机产生用户名.
   * <br>Author:Lyy
   * <br>Date:2017年4月21日
   * @param nameLength 随即字符串长度
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
        hexString = hexString.append("0");
      }
      hexString = hexString.append(hex);
    }
    return hexString.toString();
  }

}
