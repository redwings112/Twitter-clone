import { Filter } from 'bad-words';

class ProfanityFilter {
  constructor() {
    // Initialize the Filter class from bad-words
    this.filter = new Filter();

    // Add any custom words that you want to block
    this.filter.addWords('customBadWord1', 'customBadWord2'); // Example
  }

  // Method to check if a post contains profanity
  isProfane(text) {
    return this.filter.isProfane(text);
  }

  // Method to clean the text by removing or replacing profanity
  clean(text) {
    return this.filter.clean(text);
  }

  // Method to add custom words to the filter dynamically
  addCustomWords(words) {
    this.filter.addWords(...words);
  }
}

// eslint-disable-next-line 
export default new ProfanityFilter();
