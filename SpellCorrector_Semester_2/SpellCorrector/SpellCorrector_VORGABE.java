package de.hsrm.ads;

import java.util.LinkedList;
import java.util.List;

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
	
	public void add(String word) {
		// FIXME: implement
	}

	public List<Entry> generate(String word, int K) {
		// FIXME: implement
	}

	public List<String> match(String query) {
		// FIXME: implement
	}	
	
}
