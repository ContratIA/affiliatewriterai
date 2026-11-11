function scenarios({visits,clickRate,conversion,order,commission}) {
  return [.75,1,1.25].map(factor=>{
    const volume=Math.round(visits*factor);
    const clicks=volume*clickRate/100;
    const orders=clicks*conversion/100;
    return {visits:volume,clicks,orders,revenue:orders*order*commission/100};
  });
}
if (typeof document!=="undefined") {
  const form=document.querySelector("#calculator"), status=document.querySelector("#calculator-status");
  const estimate=document.querySelector("#estimate"), rows=document.querySelectorAll("[data-scenario]");
  const lang=document.documentElement.lang;
  const numbers=new Intl.NumberFormat(lang,{maximumFractionDigits:1});
  function update() {
    if (!form.checkValidity()) {
      estimate.value="—";
      status.textContent=form.dataset.invalid;
      status.dataset.error="true";
      for (const row of rows) for (const cell of row.querySelectorAll("td")) cell.textContent="—";
      return;
    }
    status.textContent="";
    status.dataset.error="false";
    const values=Object.fromEntries(["visits","clickRate","conversion","order","commission"].map(key=>[key,form.elements[key].valueAsNumber]));
    const currency=new Intl.NumberFormat(lang,{style:"currency",currency:form.elements.currency.value});
    const outcomes=scenarios(values);
    estimate.value=currency.format(outcomes[1].revenue);
    outcomes.forEach((outcome,i)=>{
      const cells=rows[i].querySelectorAll("td");
      [numbers.format(outcome.visits),numbers.format(outcome.clicks),numbers.format(outcome.orders),currency.format(outcome.revenue)].forEach((value,j)=>{cells[j].textContent=value;});
    });
  }
  form.addEventListener("input",update);
  form.addEventListener("submit",event=>{event.preventDefault();update();});
  update();
}

export { scenarios };
