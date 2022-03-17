// If a search params is in the url, highlight the tern in the table
let searchPhrase = new URLSearchParams(window.location.search).get('phrase');

const replaceString = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
};

//
// Highlight the search phrase in the table
//
// TODO: Rather than adding the <mark> tags using this client side script,
// I think content returned from the query could include the <mark> tags.
// Perhaps this could be moved to a pug template, or maybe integrate with
// the book.js controller searchAll() before it returns `books` in
// res.render('search/index', {books, ...})
//
// This should probably be refactored.

// BUG: This should allow for single letter searches, but currently
// that creates a broken table layout. Instead, I could prevent
// single letter searches from even being submitted, but not showing
// the highlighting search term, such as for 'a', is a quick solution
// for now that will still allow users to do single letter searches.
if (searchPhrase && searchPhrase.length > 1) {
  // In case the search param is two words
  searchPhrase = searchPhrase.replace(/\+/g, ' ');
  const searchRegex = new RegExp(searchPhrase, 'gi');
  const tds = document.querySelectorAll('.data-table tbody td');

  tds.forEach((td) => {
    // Don't replace text in the .actions column
    if (!td.classList.contains('actions')) {
      // Replace text in anchor tags
      const a = td.querySelector('a');

      if (a) {
        const text = a.innerText;
        const matches = text.match(searchRegex);

        if (matches) {
          let newText = text;
          const arrayOfMatches = [];
          for (let i = 0; i < matches.length; i++) {
            const thisMatchText = matches[i];
            const thisMatchIndex = text.indexOf(thisMatchText);
            const subStringBefore = text.substring(0, thisMatchIndex);
            const subStringAfter = text.substring(thisMatchIndex + thisMatchText.length);

            arrayOfMatches.push({ thisMatchText, thisMatchIndex, subStringBefore, subStringAfter });
          }

          arrayOfMatches.forEach((match) => {
            const { thisMatchText } = match;

            newText = replaceString(newText, thisMatchText, `<mark>${thisMatchText}</mark>`);
          });
          a.innerHTML = newText;
        }
      } else {
        // Replace text in other td elements
        const text = td.innerText;
        // Get number of matches
        const matches = text.match(searchRegex);
        // If there's more than one match, mark the first match only
        if (matches && matches.length > 1) {
          td.innerHTML = text.replace(searchRegex, `<mark>${matches[0]}</mark>`);
        } else {
          // If there is only one match, mark the matched text
          td.innerHTML = text.replace(searchRegex, `<mark>${searchPhrase}</mark>`);
        }
      }
    }
  });
}

//
// Handle filter param checkboxes
//

let filterParams = new URLSearchParams(window.location.search).get('filter');

// Iterate the filter parameters and check the checkboxes
if (filterParams) {
  const filterParamsArray = filterParams.split('|');

  // Check the checkbox with the same value as the filter param
  filterParamsArray.forEach((filterParam) => {
    const checkbox = document.querySelector(`input[value="${filterParam}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

//
// Handle form submit
//

const handleChange = (ev) => {
  ev.preventDefault();
  searchPhrase = ev.target.value;
};

const searchInput = document.querySelector('input[type="search"]');
searchInput?.addEventListener('change', handleChange);

// Filters

const searchFilters = document.querySelector('.search-filters');
let selectedFiltersArray = [];

searchFilters?.addEventListener('change', (ev) => {
  if (ev.target.type === 'checkbox') {
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    selectedFiltersArray = Array.from(checked).map((x) => x.value);
    filterParams = selectedFiltersArray.join('|');
  }
});

const searchForm = document.querySelector('[role="search"]');
if (searchPhrase) {
  searchForm.onsubmit = (ev) => {
    ev.preventDefault();

    if (filterParams && filterParams.length > 0) {
      window.location.href = `/books/search?phrase=${searchPhrase}&filter=${filterParams}`;
    } else {
      window.location.href = `/books/search?phrase=${searchPhrase}`;
    }
  };
}

