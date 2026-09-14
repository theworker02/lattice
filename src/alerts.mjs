/** Shared persistent errors with an explicit dismiss action; informational notices expire. */
export function displayNotice(element,message,error=false){
  clearTimeout(element.dismissTimer);
  element.hidden=false;element.dataset.severity=error?'error':'info';element.setAttribute('role',error?'alert':'status');
  const title=document.createElement('strong');title.textContent=error?'⚠ OPERATION FAILED':'LATTICE';
  const text=document.createElement('span');text.textContent=message;
  const close=document.createElement('button');close.textContent='Dismiss';close.onclick=()=>element.hidden=true;
  element.replaceChildren(title,text,close);
  if(!error)element.dismissTimer=setTimeout(()=>element.hidden=true,6500);
}
