// ¥マークと3桁区切り
export function formatPrice(price) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    }).format(Math.round(price));
};

// 税率
const Tax = 0.1;

// 税込価格から税額を計算
export function getTaxAmount(price) {
    // 税込価格 = （税抜価格 × 税率） +　税抜価格
    return (price * Tax) + price;
}