package de.hsrm.ads;

import java.io.*;
import java.util.*;

public class SpellCorrector {

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

	public SpellCorrector(int K, int N, int basis) {
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

		List<SpellCorrector.Entry> qlist = generate(query, K); // Erzeugt Liste mit reduzierten Versionen von query
		Hashtable<Integer, HashSet<String>> result = new Hashtable<>(); // Hashtable zum Speichern der Ergebnisse
		int maxDistance = 0;
		for(SpellCorrector.Entry entry : qlist){ // Iteration über die reduzierten Werte von query

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


	public static void readFile(File file, SpellCorrector sc) throws IOException {

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



	public static void main(String[] args) throws IOException {


		SpellCorrector testCorrector = new SpellCorrector(2, 1001, 31);
		File file = new File ("corncob_lowercase.txt");
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
		System.out.println(testCorrector.match("mandalorian"));


	}
	
}
