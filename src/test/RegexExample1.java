package test;

import java.util.ArrayList;
import java.util.regex.Pattern;

public class RegexExample1 {

	     public static void main(String args[]){
	         // String content = "***abcABCD_89";
	         // String content = "abc*abcABCDEFzo";
	          String content = "123*abcABCD_89";
	          //String content = "123*ABCabcd-89";
	          //����һ��������ʽ
	          String pattern = "^\\d*\\*[^\\d]*[\\w]{6}(zo)*$";
	          //���������͵�matches()����
	          //����1��matches(String regex, CharSequence input)
	          boolean isMatch = Pattern.matches(pattern, content);
	          System.out.println("�ַ������Ƿ������ 'runoob' ���ַ��� ? " + isMatch);
	          
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
