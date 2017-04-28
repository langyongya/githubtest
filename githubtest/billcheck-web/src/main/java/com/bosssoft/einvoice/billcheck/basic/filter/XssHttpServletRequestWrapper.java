package com.bosssoft.einvoice.billcheck.basic.filter;

import java.util.Iterator;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class XssHttpServletRequestWrapper extends HttpServletRequestWrapper {

  public XssHttpServletRequestWrapper(HttpServletRequest request) {
    super(request);
  }

  /**
   * <br>Description:获取参数集合
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @see javax.servlet.ServletRequestWrapper#getParameterMap()
   */
  @SuppressWarnings("rawtypes")
  public Map<String, String[]> getParameterMap() {
    Map<String, String[]> requestMap = super.getParameterMap();
    Iterator iterator = requestMap.entrySet().iterator();
    while (iterator.hasNext()) {
      Map.Entry me = (Map.Entry) iterator.next();
      String[] values = (String[]) me.getValue();
      for (int i = 0; i < values.length; i++) {
        values[i] = xssClean(values[i]);
      }
    }

    return requestMap;
  }

  /**
   * 
   * <br>Description:获取参数值
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @see javax.servlet.ServletRequestWrapper#getParameterValues(java.lang.String)
   */
  public String[] getParameterValues(String paramString) {
    String[] arrayOfString1 = super.getParameterValues(paramString);
    if (arrayOfString1 == null) {
      return null;
    }
    int i = arrayOfString1.length;
    String[] arrayOfString2 = new String[i];
    for (int j = 0; j < i; j++) {
      arrayOfString2[j] = xssClean(arrayOfString1[j]);
    }
    return arrayOfString2;
  }

  /**
   * 
   * <br>Description:获取单个参数
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @see javax.servlet.ServletRequestWrapper#getParameter(java.lang.String)
   */
  public String getParameter(String paramString) {
    String str = super.getParameter(paramString);
    if (str == null) {
      return null;
    }
    return xssClean(str);
  }

  /**
   * 
   * <br>Description:获取请求头
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @see javax.servlet.http.HttpServletRequestWrapper#getHeader(java.lang.String)
   */
  public String getHeader(String paramString) {
    String str = super.getHeader(paramString);
    if (str == null) {
      return null;
    }
    return xssClean(str);
  }

  private String xssClean(String value) {
    //ClassLoaderUtils.getResourceAsStream("classpath:antisamy-slashdot.xml",
    //XssHttpServletRequestWrapper.class)
    if (value != null) {
      // NOTE: It's highly recommended to use the ESAPI library and
      // uncomment the following line to
      // avoid encoded attacks.
      // value = encoder.canonicalize(value);
      value = value.replaceAll("\0", "");

      // Avoid anything between script tags
      Pattern scriptPattern = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
      value = scriptPattern.matcher(value).replaceAll("");

      // Avoid anything in a src='...' type of expression
      scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      value = scriptPattern.matcher(value).replaceAll("");

      scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      value = scriptPattern.matcher(value).replaceAll("");

      // Remove any lonesome </script> tag
      scriptPattern = Pattern.compile("</script>", Pattern.CASE_INSENSITIVE);
      value = scriptPattern.matcher(value).replaceAll("");

      // Remove any lonesome <script ...> tag
      scriptPattern = Pattern.compile("<script(.*?)>",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      value = scriptPattern.matcher(value).replaceAll("");

      // Avoid eval(...) expressions
      scriptPattern = Pattern.compile("eval\\((.*?)\\)",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      value = scriptPattern.matcher(value).replaceAll("");

      // Avoid expression(...) expressions
      scriptPattern = Pattern.compile("expression\\((.*?)\\)",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      value = scriptPattern.matcher(value).replaceAll("");

      // Avoid javascript:... expressions
      scriptPattern = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
      value = scriptPattern.matcher(value).replaceAll("");

      // Avoid vbscript:... expressions
      scriptPattern = Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE);
      value = scriptPattern.matcher(value).replaceAll("");

      // Avoid onload= expressions
      scriptPattern = Pattern.compile("onload(.*?)=",
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      value = scriptPattern.matcher(value).replaceAll("");
    }
    return value;

  }
}
