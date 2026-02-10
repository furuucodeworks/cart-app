import { formatPrice, getTaxAmount } from "./utils.js";
import { loadProducts } from "./products.js";

export default class Cart {
    constructor() {
        this.cart = [];
    }

    // カートに商品を追加するメソッド
    addToCart(productId, products) {
        const productsToRender = loadProducts(products)
        // cart内にクリックした商品データがあるか見つける（あればcart内の情報を取得、なければundifind）
        const inCartItem = this.cart.find((inItem) => productId === inItem.productId);

        if (inCartItem) {
            // カート内の商品アイテム数量に追加する
            inCartItem.quantity += 1;
            // 商品リストの在庫数を減らす
            productsToRender.forEach((product) => {
                if (productId === product.id) {
                    product.stock -= 1;
                }
            });
        } else {
            // カートに商品がないため新しくカートに追加するためのオブジェクトを作成
            const cartToProduct = {
                productId: productId,
                quantity: 1,
            };
            // カート内に作成したオブジェクトを追加
            this.cart.push(cartToProduct);
            // 商品リストの在庫数を減らす
            productsToRender.forEach((product) => {
                if (productId === product.id) {
                    product.stock -= 1;
                }
            });
        }
        localStorage.setItem("product", JSON.stringify(productsToRender));
        localStorage.setItem("cart", JSON.stringify(this.cart));
        return this.cart;
    }

    // カートにある商品を削除するメソッド
    removeFromCart(removeFromCartId, products) {

        const productsToRender = loadProducts(products)

        const removeFromCartItem = this.cart.find(
            (cart) => cart.productId === removeFromCartId
        );
        const removeFromCartItemIndex = this.cart.findIndex(
            (cart) => cart.productId === removeFromCartId
        );

        if (removeFromCartItem.quantity === 1) {
            this.cart.splice(removeFromCartItemIndex, 1);
        } else {
            removeFromCartItem.quantity -= 1;
        }

        const addToStockItem = productsToRender.find((product) => product.id === removeFromCartId);
        addToStockItem.stock += 1

        localStorage.setItem("product", JSON.stringify(productsToRender));
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }

    // カートを表示させるために作る表示用配列を作成するメソッド
    createCartItemsFromIds(products) {
        const productsToRender = loadProducts(products)
        // 表示用の空配列を作成
        const findProducts = [];
        // カートに入っている商品を一つずつ回す
        this.cart.forEach((inCartItem) => {
            // カートに入っている商品IDと商品リストのIDを照らし合わせて一致したら一致した商品リスト情報を変数に入れる
            const findProduct = productsToRender.find((product) => product.id === inCartItem.productId);
            // findProduct（一致した商品リスト情報）とinCartItem（カートに入っている商品の一つ）をもとに表示用配列に入れるオブジェクトを作成
            const newCreateItem = {
                id: findProduct.id,
                name: findProduct.name,
                price: findProduct.price,
                quantity: inCartItem.quantity,
            };
            // 作成したオブジェクトを表示用配列に追加
            findProducts.push(newCreateItem);
        });
        return findProducts;
    }

    // カートに表示させるメソッド
    renderCart(findProducts) {
        // カート表示エリアの要素を取得する
        const cartElement = document.querySelector("#cart");
        // 表示用の配列の中身を確認
        if (findProducts.length === 0) {
            // 配列の中身がなければ
            cartElement.innerHTML = `<p>カートに商品はありません</p>`;
        } else {
            // 配列の中身があれば配列の情報をもとにhtmlを作成する
            cartElement.innerHTML = findProducts
                .map((findProduct) => {
                    const numberCartPrice = Number(findProduct.price);
                    return `<p class="cart-item" data-id="${findProduct.id}">◯${findProduct.name}｜[価格]${formatPrice(getTaxAmount(numberCartPrice))}｜[数量] ${findProduct.quantity}個
                                <button class="removeFromCartBtn">削除</button>
                            </p>`;
                })
                .join("");
        }
    }

    // 合計金額を計算し表示させるメソッド
    renderTotalCart(findProducts) {
        // カート表示用配列を使用して合計金額を計算
        const totalCart = findProducts.reduce((sum, product) => {
            return sum + product.price * product.quantity;
        }, 0);
        // typeをnumberに
        const numberTotalCart = Number(totalCart);
        // 表示させる合計金額の要素を取得
        const cartTotalElement = document.querySelector("#cart-total");
        // textContentを使用して合計金額の表示を変更する
        cartTotalElement.textContent = `合計: ${formatPrice(getTaxAmount(numberTotalCart))}`;
    }

    // カートに入った商品の合計数量を表示させるメソッド
    renderTotalCount(findProducts) {
        // カート表示用配列を使用して合計数量を計算
        const totalCartCount = findProducts.reduce((sum, product) => {
            return sum + product.quantity;
        }, 0);
        // 合計数量を表示させる要素を取得
        const cartCountElement = document.querySelector("#cart-count");
        // textContentを使用して合計数量の表示を変更する
        cartCountElement.textContent = totalCartCount;
    }
}
