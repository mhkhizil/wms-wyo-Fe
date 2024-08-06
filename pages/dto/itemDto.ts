export type item={
    id: string,
    name: string,
    manufacturer: string,
    category: string,
    price: number,
    quantity: number,
    alert_on_qty: number,
    remark: string,
    buys:[] 
}
export type itemList={
    count:number ,
    items:item[]
}