const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkou-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const spanItem = document.getElementById('date-span');

let cart = []; // Criando um carrinho vazio

// Abrindo o modal do carrinho
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex'
});

// Fechando o modal ao clicar fora
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
});

// Fechando o modal após clicar no botão de fechar
closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
});

// Adicionando o item ao carrinho, clicando no botão de cart
menu.addEventListener('click', (e) => {
    let parentButton = e.target.closest('.add-to-cart-btn') // Pegado se existe a classe no ícone ou no buutton 'pai'

    if (parentButton) {
        const name = parentButton.getAttribute('data-name') // Pegando a propriedade do Html 'data-name'
        const price = parseFloat(parentButton.getAttribute('data-price')) // 'data-price' e Retorando o VALOR deles

        // Adicionando no carrinho
        addToCart(name, price)
    }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name) // Buscando se existe o item repetido
    if (existingItem) {
        existingItem.quantity += 1; // E caso for repetido, aumento a quantidade

    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }
    updateCartModal();

};

// Atualizando o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ''; // Zerando o conteúdo dentro do modal
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div'); // Criando uma nova DIV
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        // Criando nosso novo elemento com as informações do produto
        cartItemElement.innerHTML = `
        <div class='flex items-center justify-between'>
            <div>
                <p class='font-bold text-xl md:text-2xl'>${item.name}</p>
                <p class='font-normal md:text-2xl'>Qtd: ${item.quantity}</p>
                <p class='font-medium mt-2 md:text-2xl'>R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-btn font-bold md:text-2xl" data-name="${item.name}">
                    Remover
                </button>
        </div>
        `

        total += item.price * item.quantity // Calculando o valor dos items

        cartItemsContainer.appendChild(cartItemElement); // E colocando o elemento criado
    });

    // E mostrando o valor TOTAL E Formatando o valor em R$
    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerText = cart.length; // Aumentando a quantidade no nosso footer ao adicionar proremove-btndutos novos
};

// Removendo item do carrinho
cartItemsContainer.addEventListener('click', (e) => {
    // Se o botão clicado tiver a classe do botão de remover o produto
    if (e.target.classList.contains("remove-btn")) {
        const name = e.target.getAttribute("data-name")

        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    // Se o index for diferente de -1
    if (index !== -1) {
        const item = cart[index];

        // Se a quantidade for maior que 1, irei diminuir a quantidade e atualizar os dados do carrinho
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        // E aqui removo o produto
        cart.splice(index, 1);
        updateCartModal();
    };
};

// Pegando o valor digitado do Input de Endereço
addressInput.addEventListener('input', (e) => {
    let inputValue = e.target.value;

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add("hidden")
    }
})

// Botão de 'Finalizar Pedido'
checkoutBtn.addEventListener('click', () => {
    const isOpen = checkRestOpen();
    if (!isOpen) {

        Toastify({
            text: "No momento o restaurante está fechado, guarde seu pedido. 🛑",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === '') {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Quantidade: (${item.quantity}), Preço: R$ ${item.price} | `
        )
    }).join('')

    const message = encodeURIComponent(cartItems); // Criando a mensagem com as informações do carrinho
    const phone = '19992835005'; // Marcando o telefone a ser enviado

    // E aqui direcionamos o usuário para API do whatsApp mandando o pedido
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blank')

    cart = [];
    updateCartModal();
});

// Manipulando o horário de funcionamento e o card
function checkRestOpen() {
    const data = new Date();
    const time = data.getHours();
    return time >= 18 && time < 23; // Verificando se o horário está entre 18 e 23 para o restaurente estar aberto


};

const isOpen = checkRestOpen();
if (isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}