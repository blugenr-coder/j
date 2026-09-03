import { $ } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';

mountShell({ page: '', nav: 'public' });

$('#nf-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#nf-q').value.trim();
  location.href = href(q ? `library.html?q=${encodeURIComponent(q)}` : 'library.html');
});
