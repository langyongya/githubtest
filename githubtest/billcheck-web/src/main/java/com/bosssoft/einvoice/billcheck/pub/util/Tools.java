package com.bosssoft.einvoice.billcheck.pub.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * ClassName：com.bs.pub.util.Tools.
 * Description：通用方法工具类<br/>
 * Date：2013-8-29 下午07:09:03<br/>
 * @author lean
 * @version 1.0
 */
public class Tools {

  public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

  /**
   * 字符串是否为空.
   * 
   * @param str String
   * @return boolean
   */
  public static boolean isNullStr(String str) {
    boolean b = true;
    if (str != null && str.trim().length() > 0 && !"null".equals(str) && !"undefined".equals(str)) {
      b = false;
    }
    return b;
  }


  /**
   * 取当前日期,日期格式：yyyy-MM-dd .
   */
  public static String getDate() {
    Calendar calender = Calendar.getInstance();
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd"); // HH一定要大写，小写的话，变成12小时日期制
    format.setLenient(false);
    String datetime = format.format(calender.getTime());
    return datetime;
  }

  /**
   * 取当前日期，日期格式：yyyyMMdd .
   * 
   * @return String
   */
  public static String getDate2() {
    Calendar calender = Calendar.getInstance();
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd"); // HH一定要大写，小写的话，变成12小时日期制
    format.setLenient(false);
    String datetime = format.format(calender.getTime());
    return datetime;
  }



  /**
   * 获取N天前的日期，YYYYMMDD.
   * @param days 要查的天数
   * @return String
     */
  public static String getDateBeforeN(int days) {
    Calendar calendar1 = Calendar.getInstance();
    SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd");
    calendar1.add(Calendar.DATE, (-1) * days);
    return sdf1.format(calendar1.getTime());
  }

}