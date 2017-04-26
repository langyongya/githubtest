package com.bosssoft.einvoice.billcheck.pub.util;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.bs.eips.user.service.UserService;

import net.sf.ezmorph.bean.MorphDynaBean;
import net.sf.json.JSONObject;

/**
 * 生成验证码.
 * @author Administrator
 *
 */
public class RandImgCreater {
  //private static final Logger log = LoggerFactory
  //.getLogger(RandImgCreater.class);
  //private static final String CODE_LIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  //排除难以识别的字符  如1lLo0
  private static final String CODE_LIST = "0123456789";

  private HttpServletResponse response = null;

  private static final int HEIGHT = 20;

  private static final int FONT_NUM = 4;

  private int width = 0;

  private int inum = 0;

  private String codeList = "";

  private boolean drawBgFlag = false;

  private int rbg = 0;

  private int gbg = 0;

  private int bbg = 0;

  /**
   * 构造函数.
   * 
   */
  public RandImgCreater() {
    this.width = 13 * FONT_NUM + 12;
    this.inum = FONT_NUM;
    this.codeList = CODE_LIST;
  }

  /**
   * 
   * <br>Description:RandImgCreater.
   * @param response HttpServletResponse
   */
  public RandImgCreater(HttpServletResponse response) {
    this.response = response;
    this.width = 13 * FONT_NUM + 12;
    this.inum = FONT_NUM;
    this.codeList = CODE_LIST;
  }

  /**
   * 构造函数.
   * 
   * @param response HttpServletResponse
   * @param inum int
   * @param codeList String
   */
  public RandImgCreater(HttpServletResponse response, int inum, String codeList) {
    this.response = response;
    this.width = 13 * inum + 12;
    this.inum = inum;
    this.codeList = codeList;
  }

  public RandImgCreater(int inum) {
    this.inum = inum;
    this.codeList = CODE_LIST;
  }

  /**
   * 创建图片.
   * 
   * @return String
   */
  public String createRandImage() {
    //WJY 验证码图片
    WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
    UserService eipsUserService = (UserService) wac.getBean("eipsUserService");
    String imageJson = eipsUserService.picVerifyCode(String.valueOf(width + 30), String.valueOf(HEIGHT));
    JSONObject jsonObject = JSONObject.fromObject(imageJson);
    Map<String, Object> imageMap = (Map<String, Object>) JSONObject.toBean(jsonObject, Map.class);
    if (imageMap.get("success").equals(false)) {
      return null;
    } else {
      MorphDynaBean details = (MorphDynaBean) imageMap.get("data");
      String imagebuffer = (String) details.get("code");
      try {
        response.getOutputStream().write(decodeBase64(imagebuffer));
      } catch (IOException e) {
        e.printStackTrace();
      }
      return (String) details.get("id");
    }

  }

  /**
   * 创建图片.
   *
   * @return String
   */
  public String createRandImageByWebSelf() {
    BufferedImage image = new BufferedImage(width, HEIGHT, BufferedImage.TYPE_INT_RGB);

    Graphics g = image.getGraphics();

    Random random = new Random();

    if (drawBgFlag) {
      g.setColor(new Color(rbg, gbg, bbg));
      g.fillRect(0, 0, width, HEIGHT);
    } else {
      g.setColor(getRandColor(200, 250));
      g.fillRect(0, 0, width, HEIGHT);

      for (int i = 0; i < 155; i++) {
        g.setColor(getRandColor(140, 200));
        int x = random.nextInt(width);
        int y = random.nextInt(HEIGHT);
        int xl = random.nextInt(12);
        int yl = random.nextInt(12);
        g.drawLine(x, y, x + xl, y + yl);
      }
    }

    g.setFont(new Font("Times New Roman", Font.PLAIN, 18));

    StringBuffer sRand = new StringBuffer();
    for (int i = 0; i < inum; i++) {
      int rand = random.nextInt(codeList.length());
      String strRand = codeList.substring(rand, rand + 1);
      sRand.append(strRand);
      g.setColor(new Color(20 + random.nextInt(110), 20 + random.nextInt(110), 20 + random.nextInt(110)));
      g.drawString(strRand, 13 * i + 6, 16);
    }
    try {
      ImageIO.write(image, "JPEG", response.getOutputStream());
    } catch (IOException e) {
      e.printStackTrace();
    }
    g.dispose();
    //log.info(sRand);
    return sRand.toString();
  }

  /**
   * 字符串转成base64格式.
   *
   * @param s base64格式字符串
   * @return byte[]
   * @throws UnsupportedEncodingException 转码错误异常
   */
  public static byte[] decodeBase64(String s) throws IOException {

    return (new sun.misc.BASE64Decoder()).decodeBuffer(s);
  }

  /**
   * 
   * <br>Description:根据响应生成随机图片.
   * @return map Map
   */
  public Map<String, Object> createRandImageWithResponse() {

    BufferedImage image = new BufferedImage(width, HEIGHT, BufferedImage.TYPE_INT_RGB);

    Graphics g = image.getGraphics();

    Random random = new Random();

    if (drawBgFlag) {
      g.setColor(new Color(rbg, gbg, bbg));
      g.fillRect(0, 0, width, HEIGHT);
    } else {
      g.setColor(getRandColor(200, 250));
      g.fillRect(0, 0, width, HEIGHT);

      for (int i = 0; i < 155; i++) {
        g.setColor(getRandColor(140, 200));
        int x = random.nextInt(width);
        int y = random.nextInt(HEIGHT);
        int xl = random.nextInt(12);
        int yl = random.nextInt(12);
        g.drawLine(x, y, x + xl, y + yl);
      }
    }
    g.setFont(new Font("Times New Roman", Font.PLAIN, 18));

    StringBuffer sRand = new StringBuffer();
    for (int i = 0; i < inum; i++) {
      int rand = random.nextInt(codeList.length());
      String strRand = codeList.substring(rand, rand + 1);
      sRand.append(strRand);
      g.setColor(new Color(20 + random.nextInt(110), 20 + random.nextInt(110), 20 + random.nextInt(110)));
      g.drawString(strRand, 13 * i + 6, 16);
    }
    Map<String, Object> map = new HashMap<String, Object>();
    String ddString = TestImageBinary.getImageBinary(image);
    map.put("code", sRand);
    map.put("checkmac", ddString);
    //System.out.println(ddString);
    //TestImageBinary.base64StringToImage(ddString);
    //ByteArrayOutputStream baos = new ByteArrayOutputStream();
    //ImageIO.write(image, "JPEG", baos);
    g.dispose();
    //log.info(sRand);
    return map;
  }

  /**
   * 设置背景颜色.
   * 
   * @param r int
   * @param g int
   * @param b int
   */
  public void setBgColor(int r, int g, int b) {
    drawBgFlag = true;
    this.rbg = r;
    this.gbg = g;
    this.bbg = b;
  }

  /**
   * 设置随机颜色.
   * 
   * @param fc int
   * @param bc int
   * @return Color
   */
  private Color getRandColor(int fc, int bc) {
    Random random = new Random();
    if (fc > 255) {
      fc = 255;
    }
    if (bc > 255) {
      bc = 255;
    }
    int r = fc + random.nextInt(bc - fc);
    int g = fc + random.nextInt(bc - fc);
    int b = fc + random.nextInt(bc - fc);
    return new Color(r, g, b);
  }

  /**
   * 生成纯随机码.
   * <p>函数名称:creatRandNum</p>
   * <p>功能说明:</p>
   * <p>参数说明:</p>
   * @return String
   * @date   2014-4-4
   * @author By：DMQ
   */
  public String creatRandNum() {
    StringBuffer rands = new StringBuffer();
    Random random = new Random();
    for (int i = 0; i < inum; i++) {
      int rand = random.nextInt(codeList.length());
      String strRand = codeList.substring(rand, rand + 1);
      rands.append(strRand);
    }
    return rands.toString();
  }
}
