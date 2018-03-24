package test;

public class Student implements Person {

	int com;
	public void set_compt(int com) {

		this.com=com;
	}

	public void print_compt_information() {

		System.out.println("¶Ë¿Ú"+com);
		System.out.println("±Ê¼Ç±¾");
	}
	
	public static void main(String[] args) {
		Student com=new Student();
		com.set_compt(100);
		com.print_compt_information();
	}
}
