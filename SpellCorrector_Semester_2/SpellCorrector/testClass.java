package de.hsrm.ads;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class testClass {

//    public int stringValues(String string){
//        string.chars().forEach(c ->System.out.println(c+""));
//    }
    public static int calc(String string, int base, int n){
        int h = 0;
        for (int i = 0; i < string.length(); i++) {
            char c = string.charAt(i);
            h = (h*base+c)%n;
        }
        return h;
    }

    public static List<String> charRemove(String string, List<String> list){
        if (string.length()>0){
            list.add(string);
            for (int i = 0; i < string.length(); i++) {
                String tmp = string.substring(0, i) + string.substring(i+1);
                charRemove(tmp, list);
            }
        }
        return list;
    }

    public static List<String> reducer(String string, List<String> list, int K){
        if (string.length()>=K){
            list.add(string);
            for (int i = 0; i < string.length(); i++) {
                String tmp = string.substring(0, i) + string.substring(i+1);
                reducer(tmp, list, K);
            }
        }
        return list;
    }

    public static int summieren(int zahl){
        while (zahl>0) return zahl+summieren(zahl-1);
        return zahl;
    }



    public static void main(String[] args) {
        int zahl = 2;
        String x1 = "baby";
        int newLength = x1.length()-zahl;
        LinkedList<String> stringList1 = new LinkedList<>();
        LinkedList<String> stringList2 = new LinkedList<>();
        System.out.println(charRemove(x1, stringList1));
        System.out.println(reducer(x1, stringList2, newLength));
//        System.out.println(""+summieren(6));

//        String x1 = "W";
//        String x2 = "9";
//        x1.chars().forEach(c ->System.out.println(c+""));
//        System.out.println(""+calc(x1, 4, 10));
//        System.out.println(""+calc(x2, 4, 10));
    }
}
