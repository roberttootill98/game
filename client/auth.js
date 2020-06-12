// oauth 2.0 functions for clientside
'use strict'

async function login() {
  const url = window.location.href;
  window.location.replace(url + 'google');

  // const response = await fetch('/api/name');
  // console.log(response);
}
