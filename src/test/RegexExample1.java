package test;

import java.util.ArrayList;
import java.util.regex.Pattern;

public class RegexExample1 {

	     public static void main(String args[]){
	         // String content = "***abcABCD_89";
	         // String content = "abc*abcABCDEFzo";
	          String content = "123*abcABCD_89";
	          //String content = "123*ABCabcd-89";
	          //定义一个正则表达式
	          String pattern = "^\\d*\\*[^\\d]*[\\w]{6}(zo)*$";
	          //有两种类型的matches()方法
	          //方法1：matches(String regex, CharSequence input)
	          boolean isMatch = Pattern.matches(pattern, content);
	          System.out.println("字符串中是否包含了 'runoob' 子字符串 ? " + isMatch);
	          
	          ArrayList  lists=new ArrayList<String>();
	          
	          String s="Story";
	          s+="books";
	          System.out.println(s);
	          s+=100;
	          System.out.println(s);
	          String t=s+"xxxs";
	          System.out.println(t);
	          
	          int a=2147483647;
	       }
}
