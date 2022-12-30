function submitEditStatus(id) {
    var confirm1 = confirm('Are you sure want to change this order status?')
    if (confirm1) {
        var status = document.getElementById('changeStatus').value
        fetch('http://localhost:3000/admin/orders/', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, status })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if (data.status == 1) {
                window.location.href = '/admin/orders/'+id
            }
            else {
                alert(data.message)
            }
        })
    }
}