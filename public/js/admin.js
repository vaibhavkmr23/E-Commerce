const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    // console.log(btn);

    fetch("/admin/product/" + prodId, {
        method: 'Delete',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
}