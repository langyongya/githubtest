package com.bosssoft.einvoice.billcheck.basic.filter;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.bosssoft.einvoice.billcheck.basic.entity.CodeConstant;
import com.bosssoft.einvoice.billcheck.basic.entity.ResultCode;
import com.bosssoft.einvoice.billcheck.basic.myannotation.RefreshCsrfToken;
import com.bosssoft.einvoice.billcheck.basic.myannotation.VerifyCsrfToken;
import com.bosssoft.einvoice.billcheck.pub.util.CsrfTokenUtil;
import com.bosssoft.einvoice.billcheck.pub.util.Tools;
import com.google.gson.Gson;

/**
 * CSRFInterceptor 防止跨站请求伪造拦截器.
 *
 * @author billJiang 2016年10月6日 下午8:14:40
 */
public class CsrfInterceptor extends HandlerInterceptorAdapter {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
    throws Exception {
    System.out.println("---------->" + request.getRequestURI());
    System.out.println(request.getHeader("X-Requested-With"));
    // 提交表单token 校验
    HandlerMethod handlerMethod = null;
    Method method = null;
    VerifyCsrfToken verifyCsrfToken = null;
    if (handler instanceof HandlerMethod) {
      handlerMethod = (HandlerMethod) handler;
      method = handlerMethod.getMethod();
      verifyCsrfToken = method.getAnnotation(VerifyCsrfToken.class);
    } else {
      return true;
    }
    // 如果配置了校验csrf token校验，则校验
    if (verifyCsrfToken != null) {
      // 是否为Ajax标志
      String xrq = request.getHeader("X-Requested-With");
      // 非法的跨站请求校验
      if (verifyCsrfToken.verify() && !verifyCsrfToken(request)) {
        if (Tools.isNullStr(xrq)) {
          // form表单提交，url get方式，刷新csrftoken并跳转提示页面
          String csrftoken = CsrfTokenUtil.generate(request);
          request.getSession().setAttribute("CSRFToken", csrftoken);
          response.setContentType("application/json;charset=UTF-8");
          PrintWriter out = response.getWriter();
          out.print("非法请求");
          response.flushBuffer();
          return false;
        } else {
          // 刷新CSRFToken，返回错误码，用于ajax处理，可自定义
          Gson gson = new Gson();
          String csrftoken = CsrfTokenUtil.generate(request);
          request.getSession().setAttribute("CSRFToken", csrftoken);
          ResultCode rc = CodeConstant.CSRF_ERROR;
          response.setContentType("application/json;charset=UTF-8");
          PrintWriter out = response.getWriter();
          out.print(gson.toJson(rc));
          response.flushBuffer();
          return false;
        }
      }

    }
    return true;
  }

  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
    ModelAndView modelAndView) throws Exception {

    // 第一次生成token
    if (request.getSession(false) == null
      || Tools.isNullStr((String) request.getSession(false).getAttribute("CSRFToken"))) {
      request.getSession().setAttribute("CSRFToken", CsrfTokenUtil.generate(request));
      return;
    }

    // 刷新token
    HandlerMethod handlerMethod = null;
    Method method = null;
    RefreshCsrfToken refreshAnnotation = null;
    if (handler instanceof HandlerMethod) {
      handlerMethod = (HandlerMethod) handler;
      method = handlerMethod.getMethod();
      refreshAnnotation = method.getAnnotation(RefreshCsrfToken.class);
    }

    // 跳转到一个新页面 刷新token
    String xrq = request.getHeader("X-Requested-With");
    if (refreshAnnotation != null && refreshAnnotation.refresh() && !Tools.isNullStr(xrq)) {
      request.getSession().setAttribute("CSRFToken", CsrfTokenUtil.generate(request));
      return;
    }

    // 校验成功 刷新token 可以防止重复提交
    VerifyCsrfToken verifyAnnotation = null;
    if (method != null) {
      verifyAnnotation = method.getAnnotation(VerifyCsrfToken.class);
    }
    if (verifyAnnotation != null) {
      if (verifyAnnotation.verify()) {
        if (Tools.isNullStr(xrq)) {
          request.getSession().setAttribute("CSRFToken", CsrfTokenUtil.generate(request));
        } else {
          Gson gson = new Gson();
          Map<String, String> map = new HashMap<String, String>();
          map.put("CSRFToken", CsrfTokenUtil.generate(request));
          response.setContentType("application/json;charset=UTF-8");
          OutputStream out = response.getOutputStream();
          out.write((",'csrf':" + gson.toJson(map) + "}").getBytes("UTF-8"));
        }
      }
    }
  }

  /**
   * 
   * <br>Description:处理跨站请求伪造 针对需要登录后才能处理的请求,验证CSRFToken校验.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param request HttpServletRequest
   * @return boolean
   */
  protected boolean verifyCsrfToken(HttpServletRequest request) {

    System.out.println("===============================>>>>>>>" + request.getHeader("CSRFToken"));
    System.out
      .println("===============================>>>>>>>" + request.getSession().getAttribute("CSRFToken"));
    // 请求中的CSRFToken
    String requstCsrfToken = request.getHeader("CSRFToken");
    if (Tools.isNullStr(requstCsrfToken)) {
      return false;
    }
    String sessionCsrfToken = (String) request.getSession().getAttribute("CSRFToken");
    if (Tools.isNullStr(sessionCsrfToken)) {
      return false;
    }
    return requstCsrfToken.equals(sessionCsrfToken);
  }
}
