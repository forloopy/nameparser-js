export const parseName = (
	fullName: string
): any => {

	const titlesAndSuffixes = [
		// English
		'mr', 'mrs', 'miss', 'ms', 'dr', 'prof', 'jr', 'jnr', 'sr', 'snr', 'ii', 'iii', 'iv', 'v', 'md', 'phd', 'esq',
		// French
		'm', 'mme', 'mlle', 'monsieur', 'madame', 'mademoiselle', 'docteur', 'professeur',
		// German
		'herr', 'frau', 'fräulein', 'doktor', 'professor', 'herr doktor', 'frau doktor',
		// Spanish
		'sr', 'sra', 'srta', 'señor', 'señora', 'señorita', 'doctor', 'profesor'
	];

	const masculineTitles = [
		// English
		'mr', 'jr', 'jnr', 'sr', 'snr', 'ii', 'iii', 'iv', 'v', 'esq',

		// French
		'm', 'monsieur',

		// German
		'herr',

		// Spanish
		'sr', 'señor'
	];

	const feminineTitles = [
		// English
		'mrs', 'miss', 'ms',

		// French
		'mme', 'mlle', 'madame', 'mademoiselle',

		// German
		'frau', 'fräulein',

		// Spanish
		'sra', 'srta', 'señora', 'señorita'
	];

	const neutralTitles = [
		// Titles that don't imply gender
		'dr', 'prof', 'md', 'phd', 'doktor', 'professor'
	];

	// Common multi-word last name prefixes
	const lastNamePrefixes = ['da', 'de', 'del', 'della', 'di', 'la', 'le', 'van', 'von'];

	// Remove all periods
	fullName = fullName.replace(/\./g, '');

	// Create combined regex for titles and suffixes
	const combinedTitles = [...masculineTitles, ...feminineTitles, ...neutralTitles];
	const combinedRegex = new RegExp(`\\b(${combinedTitles.join('|')})\\b`, 'gi');

	let gender: boolean | string = false;
	let detectedTitle: any = [];

	if (new RegExp(`\\b(${masculineTitles.join('|')})\\b`, 'i').test(fullName)) {
		gender = 'm';
		detectedTitle = fullName.match(new RegExp(`\\b(${masculineTitles.join('|')})\\b`, 'i'));
	} else if (new RegExp(`\\b(${feminineTitles.join('|')})\\b`, 'i').test(fullName)) {
		gender = 'f';
		detectedTitle = fullName.match(new RegExp(`\\b(${feminineTitles.join('|')})\\b`, 'i'));
	} else if (new RegExp(`\\b(${neutralTitles.join('|')})\\b`, 'i').test(fullName)) {
		detectedTitle = fullName.match(new RegExp(`\\b(${neutralTitles.join('|')})\\b`, 'i'));
	}

	// Remove all occurrences of titles and suffixes
	fullName = fullName.replace(combinedRegex, '').trim();

	// Split the cleaned name into parts
	const nameParts = fullName.split(/\s+/);

	// Handle the case with only one name
	if (nameParts.length === 1) {
		return { firstName: nameParts[0], lastName: '', gender, title: detectedTitle };
	}

	// Handle multi-part last names based on common prefixes
	let firstName = nameParts[0];
	let lastName = nameParts.slice(1).join(' '); // Assume everything after the first name is part of the last name

	// Check for last name prefixes (like "De", "Da", "Van", etc.)
	for (let i = 0; i < nameParts.length - 1; i++) {
		if (lastNamePrefixes.includes(nameParts[i].toLowerCase())) {
			// Combine prefix with the next word to form the multi-part last name
			firstName = nameParts.slice(0, i).join(' ');
			lastName = nameParts.slice(i).join(' ');
			break;
		}
	}

	const title = detectedTitle[0];

	return { title, firstName, lastName, gender };

}