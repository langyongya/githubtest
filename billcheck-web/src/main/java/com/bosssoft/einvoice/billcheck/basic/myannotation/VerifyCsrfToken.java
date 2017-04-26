package com.bosssoft.einvoice.billcheck.basic.myannotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 
 * <br>Title:VerifyCSRFToken.
 * <br>Description:跨站请求仿照注解
 * <br>Author:Lyy
 * <br>Date:2017年4月24日
 */
@Target({ java.lang.annotation.ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface VerifyCsrfToken {

  /**
   * 
   * <br>Description:需要验证防跨站请求.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   */
  public abstract boolean verify() default true;

}
