// If there's a search params in the url, highlight the tern in the table
let searchPhrase = new URLSearchParams(window.location.search).get('search');
if (searchPhrase) {
  // In case the search param is two words
  searchPhrase = searchPhrase.replace(/\+/g, ' ');
  const searchRegex = new RegExp(searchPhrase, 'gi');
  const tds = document.querySelectorAll('.data-table tbody td');
  tds.forEach((td) => {
    // Don't replace text in the .actions column
    if (!td.classList.contains('actions')) {
      const text = td.innerText;
      const match = text.match(searchRegex);
      if (match) {
        td.innerHTML = text.replace(searchRegex, (match) => {
          return `<mark>${match}</mark>`;
        });
      }
    }
  });
}
