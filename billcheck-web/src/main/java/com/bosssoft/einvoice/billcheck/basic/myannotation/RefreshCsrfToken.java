package com.bosssoft.einvoice.billcheck.basic.myannotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <br>Title:RefreshCsrfToken.
 * <br>Description:跨站请求仿照注解 刷新CSRFToken
 * <br>Author:Lyy
 * <br>Date:2017年4月24日
 */
@Target({ java.lang.annotation.ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface RefreshCsrfToken {

  /**
   * <br>Description:刷新token.
   * <br>Author:Lyy
   * <br>Date:2017年4月24日
   */
  public abstract boolean refresh() default true;
}
