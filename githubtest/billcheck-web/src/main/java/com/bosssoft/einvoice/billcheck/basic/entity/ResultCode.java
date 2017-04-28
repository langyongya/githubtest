package com.bosssoft.einvoice.billcheck.basic.entity;

public class ResultCode {

  private String code;

  private String message;

  /**
   * <br>Description:带参构造器 .
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   * @param code String
   * @param message String
   */
  public ResultCode(String code, String message) {

    this.code = code;
    this.message = message;
  }

  public String getCode() {

    return code;
  }

  public void setCode(String code) {

    this.code = code;
  }

  public String getMessage() {

    return message;
  }

  public void setMessage(String message) {

    this.message = message;
  }

}
