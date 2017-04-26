package com.bosssoft.einvoice.billcheck.pub.util;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

/**
 * 
 * <br>Title:CSRFTokenUtil.
 * <br>Description:生成随机Token工具
 * <br>Author:Lyy
 * <br>Date:2017年4月24日
 */
public class CsrfTokenUtil {

  //随机生成UUID作为Token
  public static String generate(HttpServletRequest request) {

    return UUID.randomUUID().toString();
  }

}
