package de.hsrm.ads;

import java.io.*;
import java.util.*;

public class SpellCorrectorTestbed {

	static class Entry {

		String reducedWord;
		String origWord;

		public Entry(String changedWord, String origWord) {
			this.reducedWord = changedWord;
			this.origWord = origWord;
		}

		// how many letters have been removed?
		public int nchanged() {
			return origWord.length() - reducedWord.length();
		}

		@Override
		public String toString() {
			return "["+reducedWord+", "+origWord+"]";
		}

	}

	// Die Anzahl durchzuführender Reduktionen jedes Wortes
	int K;
	// Die Größe der internen Hash-Tabelle
	int N;
	// Die Basis der Hashfunktion der internen Hash-Tabelle
	int basis;

	public SpellCorrectorTestbed(int K, int N, int basis) {
		this.K = K;
		this.N = N;
		this.basis = basis;
	}

	Hashtable<String, LinkedList<String>> table = new Hashtable<>();


	public void add(String word) {
		List<Entry> variants = generate(word, K);
		for (Entry e: variants){
			String key = e.reducedWord;

			if (table.get(key) == null) { // Prüfe, ob Key-Position leer
				LinkedList list = new LinkedList(); // Erzeuge leere LinkedList
				list.add(word);
				table.put(key, list); // Füge an Key-Position übergebenes Wort in einer LinkedList hinzu

			} else if(table.get(key) != null) {
				LinkedList<String> value = (LinkedList<String>) table.get(key); // Rückgabe der bereits vorhandenen LinkedList
				value.add(word); // Hinzufügen des neuen Worts zur bereits vorhandenen LinkedList
				table.put(key, value); // Setzen der erweiterten LinkedList auf Key-Position
			}
		}
	}


	public static Hashtable<String, String> reducer(String newString, String origString, Hashtable table, int K){
		if (newString.length()>=origString.length()-K){ // Bedingung, um sicherzustellen, dass nur K Buchstaben entfernt werden
			table.put(newString, origString);
			for (int i = 0; i < newString.length(); i++) { // Iteration über alle Buchstaben im Wort
				String tmp = newString.substring(0, i) + newString.substring(i+1); // Neuer String ohne Buchstabe an Index i; baby.substring(0,2) = ba + baby.substring(2+1) = y  => bay
				reducer(tmp, origString, table, K); // Rekursiver Aufruf
			}
		}
		return table;
	}

	public List<Entry> generate(String word, int K) {
		Hashtable<String, String> table = new Hashtable<>();
		table = reducer(word, word, table, K);
		List<Entry> result = new ArrayList<>();
		table.forEach((k,v)-> result.add(new Entry(k, v)));
		return result;
	}


	public static int distance(int q, int qReduced, int word){
		int calc1 = q-qReduced;
		int calc2 = word-qReduced;
		return calc1+calc2;
	}

	public List<String> match(String query) {

		List<SpellCorrectorTestbed.Entry> qlist = generate(query, K); // Erzeugt Liste mit reduzierten Versionen von query
		Hashtable<Integer, HashSet<String>> result = new Hashtable<>(); // Hashtable zum Speichern der Ergebnisse
		int maxDistance = 0;
		for(SpellCorrectorTestbed.Entry entry : qlist){ // Iteration über die reduzierten Werte von query

			if (table.get(entry.reducedWord)!=null){ // Check, ob im table an derselben Position wie in de qlist ein Eintrag existiert

				for (String x : table.get(entry.reducedWord)){ // Iteration über den Eintrag
					int distance = distance(query.length(), entry.reducedWord.length(), x.length()); // Berechnung der Distanz
					if (distance >= maxDistance) maxDistance = distance;

					if (result.get(distance) != null) { // Wenn am Index 'distance' ein Eintrag existiert, soll das x Element hinzugefügt werden
						result.get(distance).add(x);
						if (entry.reducedWord.equals("") && distance == 0) {
							HashSet<String> empty = new HashSet<>();
							empty.add("");
							result.put(distance, empty);
						}
					} else {
						HashSet<String> neu = new HashSet<>(); // Wenn am Index 'distance' kein Eintrag existiert, soll ein neues HashSet mit Element x hinzugefügt werden
						neu.add(x);
						result.put(distance, neu);
					}
				}
			}
		}
		List<String> newResult = new LinkedList<>();

		if (result.isEmpty()) return newResult;

		for (int i = 0; i <= maxDistance; ) {
			if (maxDistance>0) i++;
			if (result.get(i) != null) {
				newResult.addAll(result.get(i));
				break;
			}
		}
		return newResult;
	}


	public static void readFile(File file, SpellCorrectorTestbed sc) throws IOException {

		InputStream in = new FileInputStream(file);
		BufferedReader br = new BufferedReader(new InputStreamReader(in));

		String line;
		try {
			while ((line = br.readLine()) != null) {
				sc.add(line);
			}
		} catch (IOException e){
			e.printStackTrace();
		}
	}

	public static LinkedList<Character> readFile2(File file) throws IOException {

		InputStream in = new FileInputStream(file);
		BufferedReader br = new BufferedReader(new InputStreamReader(in));
		LinkedList<Character> result = new LinkedList<>();

		String line;
		try {
			while ((line = br.readLine()) != null) {
				char x = line.charAt(0);
				result.add(x);
			}
		} catch (IOException e){
			e.printStackTrace();
		}
		return result;
	}

	public static LinkedList<String> charReplacer(String word, LinkedList<Character> list){
		LinkedList<String> result = new LinkedList<>();
		char[] array = word.toCharArray();
		for (int i = 0; i < array.length; i++) {
			char[] tmp = array.clone();
			for (char s: list ){
				tmp[i] = s;
				String w = String.valueOf(tmp);
				result.add(w);
			}
		}
		return result;
	}



	public static void main(String[] args) throws IOException {

		File kana = new File ("kanatest.txt");
		LinkedList<Character> char1 = readFile2(kana);
		String kanaword = "あいうえおたちつてとかき";
		LinkedList<String> l1 = charReplacer(kanaword, char1);

		Hashtable<String, String> testTable = new Hashtable<>();
		for (String str : l1){
			reducer(str, str, testTable, 1);
		}

		/*SpellCorrectorTestbed testCorrector = new SpellCorrectorTestbed(2, 1001, 31);
		File file = new File ("/home/daniel/Nextcloud/Uni/2-Semester/ADS/Praktikum/Intellij/Uebungsblaetter_ADS/Uebungsblatt_10_ADS/src/de/hsrm/ads/corncob_lowercase.txt");
		readFile(file, testCorrector);

		System.out.println(testCorrector.match("academi"));
		System.out.println(testCorrector.match("xillion"));
		System.out.println(testCorrector.match("aoor"));
		System.out.println(testCorrector.match("bokworm"));
		System.out.println(testCorrector.match("wolfes"));
		System.out.println(testCorrector.match("kubernetes"));
		System.out.println(testCorrector.match("linux"));
		System.out.println(testCorrector.match("daenerys"));
		System.out.println(testCorrector.match("xmas"));
		System.out.println(testCorrector.match("mandalorian"));*/

/*		String word = "あいうえおたちつてとかき";

*//*		char[] array = word.toCharArray();
		for (int i = 0; i < array.length; i++) {
			for (char s: char1 ){
				char[] tmp = array;
				tmp[i] = s;
				String w = tmp.toString();
				result.add(w);
			}
		}*/


		SpellCorrectorTestbed kanaCorrector = new SpellCorrectorTestbed(1, 1001, 31);
		kanaCorrector.add(kanaword);
		int counter = 0;

/*		for (String e : l1){
			kanaCorrector.add(e);
		}*/

//
		List<String> result = new LinkedList<>();

		for (String str : l1){
			List<String> tmp = kanaCorrector.match(str);
			for (String s : tmp) result.add(s);
		}

		for (String str: result){
			counter++;
		}

		int keys = 0;

		for (String str : kanaCorrector.table.keySet()){
			keys++;
		}

//		for (int i = 0; i < kanaCorrector.table.size(); i++) {
//			if (kanaCorrector.table.get(i)!=null ){
//				LinkedList<String> sublist = kanaCorrector.table.get(i);
//				for (String str : sublist){
//					counter++;
//				}
//			}
//		}

		Hashtable<String, LinkedList<String>> kTable = kanaCorrector.table;
		for(String str: testTable.keySet()){
			for (String s : kTable.keySet()){
				if (kTable.get(s)!=null) kTable.get(s).add(testTable.get(str));
			}
		}
		int kCounter = 0;
		for (String e : kTable.keySet()){
			for (String b : kTable.get(e)){
				kCounter++;
			}
		}





//		System.out.println(result);
		System.out.println(kTable);
//		System.out.println(kanaCorrector.table);
//		System.out.println(result);
		System.out.println(""+counter);
		System.out.println(""+keys);
		System.out.println(""+kCounter);
/*		System.out.println(l1);
		System.out.println(char1);*/




	}

}
