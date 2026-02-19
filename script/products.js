// 商品リスト
export const products = [
    { id: 1, name: "メキシコ・マヤビニック[120g]", price: 1000, stock: 5, img: "/photo/ののた.png" },
    { id: 2, name: "メキシコ・マヤビニック[240g]", price: 1900, stock: 2, img: "/photo/ののた.png" },
    { id: 3, name: "タンザニア・キゴマ[120g]", price: 1100, stock: 1, img: "/photo/ののた.png" },
    { id: 4, name: "タンザニア・キゴマ[240g]", price: 2100, stock: 0, img: "/photo/ののた.png" },
    { id: 5, name: "ドリップバッグ5袋", price: 1000, stock: 5, img: "/photo/ののた.png" },
    { id: 6, name: "ドリップバッグ10袋", price: 1900, stock: 2, img: "/photo/ののた.png" }
];

// 商品データをローカスストレージから読み込み   
export function loadProducts(products){
    try{
        const productsStr = localStorage.getItem("product");
        const productsToRender = productsStr ? JSON.parse(productsStr) : products;
        return productsToRender;
    }catch(error){
        alert("読み込みができませんでした");
        return products;
    };
}

