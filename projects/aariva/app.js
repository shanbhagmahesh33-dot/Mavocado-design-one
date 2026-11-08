(() => {
 'use strict';
 document.querySelectorAll('svg:not(.svg-library)').forEach(svg=>{svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false')});
 const nav=document.querySelector('#navigation'),toggle=document.querySelector('.menu-toggle');
 function closeNav(){nav.querySelectorAll('details[open]').forEach(d=>d.open=false);nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation')}
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
 document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))closeNav()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
 matchMedia('(min-width:851px)').addEventListener('change',closeNav);
 nav.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)nav.querySelectorAll('details').forEach(other=>{if(other!==d)other.open=false})}));
 const booking=document.querySelector('#booking-dialog'),information=document.querySelector('#information-dialog'),form=document.querySelector('#booking-form'),success=document.querySelector('#booking-success');
 let returnFocus=null;
 const today=new Date(),localDate=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 form.elements.date.min=localDate;
 function openBooking(trigger){
  const previousFocus=returnFocus,fromInformation=information.open;
  if(fromInformation)information.close();returnFocus=fromInformation?previousFocus:trigger;
  form.reset();form.hidden=false;success.hidden=true;
  const dept=trigger.dataset.dept||trigger.dataset.specialty||'';
  if(dept)form.elements.department.value=dept;
  document.querySelector('#booking-intro').textContent=trigger.dataset.doctor?'Explore an appointment request with '+trigger.dataset.doctor+'.':'Choose your preference and explore the appointment journey.';
  closeNav();booking.showModal();
 }
 document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking(b)));
 for(const dialog of [booking,information]){
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('close',()=>{if(dialog===booking){form.reset();form.hidden=false;success.hidden=true}if(returnFocus?.isConnected)returnFocus.focus()});
 }
 document.querySelector('[data-close]').addEventListener('click',()=>booking.close());
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(form.elements.date.value<localDate){form.elements.date.setCustomValidity('Choose today or a future date.');form.elements.date.reportValidity();return}form.hidden=true;success.hidden=false;success.setAttribute('tabindex','-1');success.focus()});
 form.elements.date.addEventListener('input',()=>form.elements.date.setCustomValidity(''));
 const infoData={
  wellness:{title:'Everyday wellness',copy:'An illustrative preventive health pathway. Discuss your history, lifestyle and concerns with a clinician before choosing any tests.',items:['Review your personal and family health history.','Ask which checks are relevant to you.','Discuss how and when to review any results.'],book:true},
  'heart-check':{title:'Heart health',copy:'A conversation about personal risk factors can help a qualified clinician guide suitable evaluation. This concept does not recommend a fixed testing package.',items:['Discuss your history and any concerns.','Ask which checks are appropriate for your circumstances.','Agree on a follow-up plan with your clinician.'],book:true},
  'women-check':{title:'Women’s wellness',copy:'An illustrative pathway for discussing health needs through different life stages. Your clinician should guide any screening based on your individual circumstances.',items:['Bring your questions and relevant records.','Discuss your personal health history.','Ask about an appropriate ongoing care plan.'],book:true},
  emergency:{title:'Need urgent medical help?',copy:'This is a fictional hospital homepage, not an emergency service. For a medical emergency, contact your local emergency service or go to an appropriate emergency facility.',items:[],book:false},
  'care-team':{title:'Start with a conversation.',copy:'A care coordinator can help explain appointment options and connect you with an appropriate specialty. This homepage previews that experience; it does not connect to a real hospital.',items:['Describe what you need help arranging.','Ask which records to bring to your consultation.','Confirm location, timing and appointment details.'],book:true},
  billing:{title:'Clarity before your visit.',copy:'Coverage and costs depend on your policy, provider and planned care. Confirm the details directly before making a decision.',items:['Ask what your policy includes and excludes.','Check whether pre-authorisation is required.','Request a written estimate from the care provider.'],book:false},
  followup:{title:'Keep the next step clear.',copy:'Use your care team’s instructions to prepare for a follow-up. This page does not provide medical advice.',items:['Keep the instructions and records from your visit.','Write down questions for your next consultation.','Confirm when and how results will be discussed.'],book:false},
  privacy:{title:'Your privacy in this preview.',copy:'This prototype does not submit, store or transmit appointment entries. It does not use analytics or cookies. Closing the appointment preview clears its fields. The hospital identity, clinician profiles and images are illustrative.',items:[],book:false}
 };
 const specialtyData={
  'Cardiology':{title:'Cardiac care',copy:'An illustrative specialty overview bringing consultations, diagnostic evaluation and ongoing heart-care conversations together.',items:['Consultations with a cardiac specialist','Discussion of relevant tests and reports','Coordinated follow-up planning']},
  'Neurosciences':{title:'Neurosciences',copy:'An illustrative overview for specialist consultations concerning the brain, spine and nervous system.',items:['Neurology consultations','Review of previous reports','Discussion of care and follow-up options']},
  'Orthopaedics':{title:'Bone & joint care',copy:'An illustrative overview for specialist care relating to bones, joints and movement.',items:['Orthopaedic consultations','Joint and mobility concerns','Discussion of rehabilitation and follow-up']},
  'Women & child care':{title:'Women & child care',copy:'An illustrative specialty bringing women’s health and family-centred care into a connected experience.',items:['Women’s health consultations','Care conversations through life stages','Coordination with relevant specialists']},
  'General medicine':{title:'General medicine',copy:'An illustrative first point of contact for general health concerns and coordination with relevant specialties.',items:['General physician consultations','Review of health history','Guidance on appropriate specialist follow-up']},
  'Oncology':{title:'Cancer care',copy:'An illustrative multidisciplinary specialty, with an emphasis on informed discussions and coordinated support.',items:['Specialist consultations','Review of available records','Conversations about care planning']},
  'Gastroenterology':{title:'Digestive & liver care',copy:'An illustrative specialty overview for digestive and liver-related consultations.',items:['Gastroenterology consultations','Review of relevant reports','Discussion of further evaluation with a specialist']},
  'Kidney care':{title:'Kidney care',copy:'An illustrative specialty overview for kidney-related consultations and coordinated follow-up.',items:['Specialist consultations','Review of kidney-related health records','Conversations about continuing care']}
 };
 function showInfo(data,trigger,label='AARIVA HOSPITALS',department=''){
  returnFocus=trigger;document.querySelector('#information-label').textContent=label;
  document.querySelector('#information-title').textContent=data.title;document.querySelector('#information-copy').textContent=data.copy;
  const list=document.querySelector('#information-list');list.replaceChildren();for(const text of data.items){const li=document.createElement('li');li.textContent=text;list.append(li)}list.hidden=!data.items.length;
  const b=document.querySelector('#information-book');b.hidden=data.book===false;b.dataset.dept=department;delete b.dataset.doctor;closeNav();information.showModal();
 }
 document.querySelectorAll('[data-info]').forEach(b=>b.addEventListener('click',()=>showInfo(infoData[b.dataset.info],b)));
 document.querySelectorAll('[data-specialty]').forEach(b=>b.addEventListener('click',()=>showInfo(specialtyData[b.dataset.specialty],b,'SPECIALTY OVERVIEW · ILLUSTRATIVE',b.dataset.specialty)));
 const cards=[...document.querySelectorAll('.doctor-card')],search=document.querySelector('#doctor-search'),filter=document.querySelector('#doctor-filter'),count=document.querySelector('#doctor-count');
 function filterDoctors(){const q=search.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const matches=(!filter.value||c.dataset.department===filter.value)&&(c.dataset.name+' '+c.dataset.department).toLowerCase().includes(q);c.hidden=!matches;if(matches)n++});count.textContent=n+' specialist'+(n===1?'':'s');document.querySelector('#no-doctors').hidden=n!==0}
 search.addEventListener('input',filterDoctors);filter.addEventListener('change',filterDoctors);document.querySelector('#reset-doctors').addEventListener('click',()=>{search.value='';filter.value='';filterDoctors();search.focus()});
 document.querySelectorAll('[data-profile]').forEach(b=>b.addEventListener('click',()=>{const c=cards[Number(b.dataset.profile)];showInfo({title:c.dataset.name,copy:'Illustrative consultant profile for '+c.dataset.department.toLowerCase()+'. This fictional profile demonstrates how patients can explore a specialist and begin an appointment request.',items:['Specialty: '+c.dataset.department,'Location: Aariva Medical Campus, Bengaluru','Appointment preferences can be explored in this prototype.']},b,'YOUR CARE TEAM · ILLUSTRATIVE',c.dataset.department);document.querySelector('#information-book').dataset.doctor=c.dataset.name}));
 const tabs=[...document.querySelectorAll('[role=tab]')];
 function selectTab(index,focus=false){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==index});if(focus)tabs[index].focus()}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(i));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(next,true)}})});
})();
