package com.bosssoft.einvoice.billcheck.pub.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/** 
 *
 * @ClassName   类名：TestImageBinary 
 * @Description 功能说明：

 ************************************************************************
 * @date        创建日期：2014-5-9
 * @author      创建人：陈熙
 * @version     版本号：V1.0
 *<p>
 ***************************修订记录*************************************
 * 
 *   2014-5-9   陈熙   创建该类功能。
 *
 ***********************************************************************
 *</p>
 */
public class TestImageBinary {
  static BASE64Encoder encoder = new sun.misc.BASE64Encoder();

  static BASE64Decoder decoder = new sun.misc.BASE64Decoder();

  public static void main(String[] args) {
    //            System.out.println(getImageBinary());  //将图片转成base64编码     
    //        base64StringToImage(getImageBinary()); //将base64的编码转成图片   
  }

  /**
   * 
   * <br>Description:getImageBinary.
   * @param bi BufferedImage
   * @return String
   */
  public static String getImageBinary(BufferedImage bi) {
    try {
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageIO.write(bi, "jpg", baos);
      byte[] bytes = baos.toByteArray();

      return encoder.encodeBuffer(bytes).trim();
    } catch (IOException e) {
      //e.printStackTrace();    
    }
    return null;
  }
}
