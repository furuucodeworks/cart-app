import { products, loadProducts } from "./products.js";
import { getTaxAmount, formatPrice } from "./utils.js";
import Cart from "./cart.js";

// Gitの練習で追加したコメント

// 商品表示関数
function renderProducts(products) {
    // 商品を表示する要素を取得
    const productSection = document.querySelector("#products");
    const productsToRender = loadProducts(products)
    
    productSection.innerHTML = productsToRender
        .map((product) => {
            const numberPrice = Number(product.price);
            // 在庫があるかないかで表示するhtmlを変える
            if (product.stock !== 0) {
                return `<div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}">
                    <img class="product-image" src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>税込：${formatPrice(getTaxAmount(numberPrice))}</p>
                    <p>在庫：${product.stock}</p>
                    <button class="cartToAddBtn">カートに追加</button>
                </div>`;
            } else {
                return `<div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}">
                    <img class="product-image" src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>税込：${formatPrice(getTaxAmount(numberPrice))}</p>
                    <p>売り切れ</p>
                    <button disabled class="cartToAddBtn">カートに追加</button>
                </div>`;
            }
        })
        .join("");
}

// 商品表示用の関数
renderProducts(products);


// 商品リストが表示されるのを待つ
window.addEventListener("load", () => {
    const cart = new Cart();
    try{
        const cartStr = localStorage.getItem("cart");
        if (cartStr) {
            cart.cart = JSON.parse(cartStr);
        }
    }catch(error){
        alert("読み込みができませんでした");
        cart.cart = [];
    }
    // カートに入っているかどうかを判定
    if (cart.cart.length === 0) {
        const noItemCart = document.querySelector("#cart");
        // カートに商品はありませんと表示させる
        noItemCart.innerHTML = `<p>カートに商品はありません</p>`;
    } else {
        // カートに入っていればカートを表示させる
        const findProducts = cart.createCartItemsFromIds(products);
        // カートを表示
        cart.renderCart(findProducts);
        // 合計金額を表示
        cart.renderTotalCart(findProducts);
        // 合計数量を表示
        cart.renderTotalCount(findProducts);
    }

    // ボタンの親要素を取得
    const productsElement = document.querySelector("#products");
    // クリックして.cartToAddBtnに近い（今回は結果一致する）要素を取得
    productsElement.addEventListener("click", (event) => {
        const cartToAddBtn = event.target.closest(".cartToAddBtn");
        // 入っていなかったり、売り切れとなっていたらreturnする
        if (!cartToAddBtn || cartToAddBtn.disabled) return;

        // ボタン要素の親要素を取得
        const product = cartToAddBtn.parentElement;
        // idをnumberに
        const productId = Number(product.dataset.id);

        // カートに追加
        cart.addToCart(productId, products);

        // 商品を表示させる
        renderProducts(products);

        // 表示用の配列を作成して変数に入れる
        const findProducts = cart.createCartItemsFromIds(products);

        // カートを表示させる
        cart.renderCart(findProducts);
        // 合計金額を表示させる
        cart.renderTotalCart(findProducts);
        // 合計数量を表示させる
        cart.renderTotalCount(findProducts);
    });

    // カート商品削除と在庫の追加
    const cartElement = document.querySelector("#cart");
    cartElement.addEventListener("click", (event) => {
        // ＝＝＝＝押した削除ボタンの商品のidを取得する＝＝＝＝
        const removeFromCartBtn = event.target.closest(".removeFromCartBtn");
        if (!removeFromCartBtn) return;
        const removeFromCartItemElement = removeFromCartBtn.parentElement;
        const removeFromCartId = Number(removeFromCartItemElement.dataset.id);
        // ======ここまで＝＝＝＝＝

        cart.removeFromCart(removeFromCartId, products);
        const findProducts = cart.createCartItemsFromIds(products);
        renderProducts(products);
        cart.renderCart(findProducts);
        cart.renderTotalCart(findProducts);
        cart.renderTotalCount(findProducts);
    });
});