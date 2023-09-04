// 獲取購物車按鈕和視窗元素

var cartButton = document.getElementById('buycar');
var cartWindow = document.querySelector('.cartWindow');

// 點擊購物車按鈕時顯示視窗內容
function windowopen() {
    var cartWindow = document.querySelector('.cartWindow');
    cartWindow.classList.add('active');

}

var x = document.getElementById("x");
x.addEventListener('click', function () {
    cartWindow.classList.remove('active');
}
)





/*=====================================購物車功能開始=========================================*/

window.addEventListener('load', function () {
    var foodList = [
        {
            id: 'omurice',
            name: '蛋包飯',
            price: 90,
            image: '00/1106-2.jpg',
            prepTime: 10, // Default preparation time in minutes for 蛋包飯
        },
        // Add other meal items here...
        {
            id: 'bakedrice',
            name: '焗飯',
            price: 50,
            image: '00/1106-7.jpg',
            prepTime: 5, // Default preparation time in minutes for 鬆餅
        },
        // Add the new meal item here...
        {
            id: 'melaleuca',
            name: '千層麵',
            price: 80,
            image: '00/1106-4.jpg',
            prepTime: 10, // Default preparation time in minutes for 千層麵
        },

        {
            id: 'pizza',
            name: '披薩',
            price: 399,
            image: '00/224.jpg',
            prepTime: 15,
        },

        {
            id: 'pasta',
            name: '義大利麵',
            price: 115,
            image: '00/1106-5.jpg',
            prepTime: 10,
        },

        {
            id: 'stew',
            name: '燉飯',
            price: 120,
            image: '00/1106-6.jpg',
            prepTime: 20,
        },

        {
            id: 'omuricecombo',
            name: '蛋包飯套餐',
            price: 150,
            image: '00/1106-2.jpg',
            prepTime: 10,
        },
        
        {
            id: 'muffin',
            name: '鬆餅套餐',
            price: 50,
            image: '00/1106-3.jpg',
            prepTime: 5,
        },

        {
            id: 'souffle',
            name: '舒芙蕾套餐',
            price: 60,
            image: '00/1106-8.jpg',
            prepTime: 5,
        },

        {
            id: 'cake',
            name: '蛋糕套餐',
            price: 80,
            image: '00/1106-9.jpg',
            prepTime: 5,
        },

        {
            id: 'pastacombo',
            name: '義大利麵套餐',
            price: 150,
            image: '00/1106-5.jpg',
            prepTime: 10,
        },

        {
            id: 'sundae',
            name: '聖代套餐',
            price: 50,
            image: '00/1106-10.jpg',
            prepTime: 5,
        },

        {
            id:'blacktea',
            name:'紅茶',
            price:30,
            image:'00/1106-11.jpg',
            prepTime:5,
        },

        {
            id:'american',
            name:'美式',
            price:30,
            image:'00/1106-12.jpg',
            prepTime:5,
        },

        {
            id:'latte',
            name:'拿鐵',
            price:40,
            image:'00/1106-13.jpg',
            prepTime:5,
        },

        {
            id:'cappuccino',
            name:'卡布奇諾',
            price:50,
            image:'00/1106-14.jpg',
            prepTime:5,
        },

        {
            id:'macchiato',
            name:'瑪奇朵',
            price:55,
            image:'00/1106-15.jpg',
            prepTime:5,
        },

        {
            id:'hotcoco',
            name:'熱可可',
            price:60,
            image:'00/1106-16.jpg',
            prepTime:5,
        },

        {
            id:'honeytoast',
            name:'蜂蜜土司',
            price:30,
            image:'00/1106-17.jpg',
            prepTime:5,
        },
        
        {
            id:'waffledessert',
            name:'鬆餅',
            price:50,
            image:'00/1106-18.jpg',
            prepTime:5,
        },

        {
            id:'souffledessert',
            name:'舒芙蕾',
            price:60,
            image:'00/1106-19.jpg',
            prepTime:5,
        },

        {
            id:'frie',
            name:'薯條',
            price:40,
            image:'00/1106-20.jpg',
            prepTime:5,
        },

        {
            id:'eggtart',
            name:'蛋塔',
            price:25,
            image:'00/1106-21.jpg',
            prepTime:5,
        },

        {
            id:'icecream',
            name:'冰淇淋',
            price:50,
            image:'00/1106-22.jpg',
            prepTime:5,
        }

    ];



    var fooditems = document.getElementById('fooditems');

    function countItemsInCart(mealType) {
        var count = 0;
        var foodElements = fooditems.querySelectorAll(`[id="${mealType}"]`);
        for (var i = 0; i < foodElements.length; i++) {
            if (foodElements[i].id === mealType) {
                count++;
            }
        }
        return count;
    }

    function calculateTotalAmount() {
        var foodElements = fooditems.getElementsByClassName('fooditem');
        var totalAmount = 0;
        var orderForm = document.getElementById('orderForm');
        for (var i = 0; i < foodElements.length; (i++) / 2) {
            var mealType = foodElements[i].id;
            var quantityElement = foodElements[i].querySelector(`.${mealType}quantity`);
            var quantity = parseInt(quantityElement.innerText);

            var existingInput = orderForm.querySelector(`[name="${mealType}quantity"]`);
            if (existingInput) {
                existingInput.value = quantity.toString();
            } else {
                var inputElement = document.createElement("input");
                inputElement.type = "hidden";
                inputElement.name = mealType + "quantity";
                inputElement.value = quantity.toString();
                orderForm.appendChild(inputElement);
            }
        }
        for (var i = 0; i < foodElements.length; i++) {
            var mealType = foodElements[i].id;
            var quantityElement = foodElements[i].querySelector(`.${mealType}quantity`);
            var quantity = parseInt(quantityElement.innerText);

            var meal = foodList.find(item => item.id === mealType);
            if (meal) {
                totalAmount += meal.price * quantity;
            }
        }
        return totalAmount;
    }

    function calculateTotalPrepTime() {
        var foodElements = fooditems.getElementsByClassName('fooditem');
        var totalPrepTime = 0;
        for (var i = 0; i < foodElements.length; i++) {
            var mealType = foodElements[i].id;
            var quantityElement = foodElements[i].querySelector(`.${mealType}quantity`);
            var quantity = parseInt(quantityElement.innerText);
            var meal = foodList.find(item => item.id === mealType);
            if (meal) {
                totalPrepTime += meal.prepTime * quantity;

            }
        }
        return totalPrepTime;
    }


    function updateTotalAmount() {
        var totalAmount = calculateTotalAmount();
        var totalPrepTime = calculateTotalPrepTime();
        document.getElementById('sqlprice').value = totalAmount;
        document.getElementById('sqltime').value = totalPrepTime;

        if (totalPrepTime >= 60) {
            totalPrepTime = parseInt(totalPrepTime / 60) + '分鐘' + (totalPrepTime % 60) + '秒';
        } else {
            totalPrepTime = totalPrepTime + '秒';
        }
        document.getElementById('money').innerText = '金額：$' + totalAmount;
        document.getElementById('time').innerText = '預計時間：' + totalPrepTime;
    }



    function showFoodItems(mealType) {

        var mealCount = countItemsInCart(mealType);
        if (mealCount < 1) {
            var meal = foodList.find(item => item.id === mealType);
            if (meal) {
                var mealElement = `
                <div id="${meal.id}" class="fooditem">
                    <div class="deletemeal">X</div>
                    <img src="${meal.image}" alt="${meal.name}" width="auto" height="100%" class="foodimg">
                    <div class="foodp">$${meal.price}</div>
                    <div class="foodname">${meal.name}</div>
                    <div class="prepTime">${meal.prepTime} 秒</div> <!-- Display the preparation time -->
                    <div class="controlband">
                        <div class="bandbtn">-</div>
                        <div class="${meal.id}quantity">1</div>
                        <div class="bandbtn">+</div>
                    </div>
                </div>
            `;
                fooditems.innerHTML += mealElement;
                updateTotalAmount(); // Update the total amount after adding a food item
            }
        }
    }





    fooditems.addEventListener('click', function (event) {
        var target = event.target;
        if (target.classList.contains('deletemeal')) {
            target.parentElement.remove();
            orderForm.removeChild(orderForm.querySelector(`[name="${target.parentElement.id}quantity"]`));
            updateTotalAmount(); // Update the total amount after removing a food item
        } else if (target.classList.contains('bandbtn')) {
            var mealType = target.parentElement.parentElement.id;
            var quantityElement = target.parentElement.querySelector(`.${mealType}quantity`);
            var quantity = parseInt(quantityElement.innerText);
            if (target.innerText === '+') {
                if (quantity < 10) {
                    quantity++;
                } else {
                    alert('最多只能買10個');
                }
            } else if (target.innerText === '-') {
                if (quantity > 1) {
                    quantity--;
                } else {
                    alert('最少要買一個');
                }
            }
            quantityElement.innerText = quantity;
            updateTotalAmount(); // Update the total amount after changing the quantity of a food item
        }
    });
    document.getElementById('omuricebuycarbtn').addEventListener('click', function () {
        showFoodItems('omurice');
    });

    document.getElementById('bakedricebuycarbtn').addEventListener('click', function () {
        showFoodItems('bakedrice');
    });

    // Add event listener for the new meal item button
    document.getElementById('melaleucabuycarbtn').addEventListener('click', function () {
        showFoodItems('melaleuca');
    });

    document.getElementById('pizzabuycarbtn').addEventListener('click', function () {
        showFoodItems('pizza');
    });

    document.getElementById('pastabuycarbtn').addEventListener('click', function () {
        showFoodItems('pasta');
    });

    document.getElementById('stewbuycarbtn').addEventListener('click', function () {
        showFoodItems('stew');
    });

    document.getElementById('omuricecombobuycarbtn').addEventListener('click', function () {
        showFoodItems('omuricecombo');
    });

    document.getElementById('muffinbuycarbtn').addEventListener('click', function () {
        showFoodItems('muffin');
    });

    document.getElementById('soufflebuycarbtn').addEventListener('click', function () {
        showFoodItems('souffle');
    });

    document.getElementById('cakebuycarbtn').addEventListener('click', function () {
        showFoodItems('cake');
    });

    document.getElementById('pastacombobuycarbtn').addEventListener('click', function () {
        showFoodItems('pastacombo');
    });

    document.getElementById('sundaebuycarbtn').addEventListener('click', function () {
        showFoodItems('sundae');
    });

    document.getElementById('blackteabuycarbtn').addEventListener('click', function () {
        showFoodItems('blacktea');
    });

    document.getElementById('americanbuycarbtn').addEventListener('click', function () {
        showFoodItems('american');
    });

    document.getElementById('lattebuycarbtn').addEventListener('click', function () {
        showFoodItems('latte');
    });

    document.getElementById('cappuccinobuycarbtn').addEventListener('click', function () {
        showFoodItems('cappuccino');
    });

    document.getElementById('macchiatobuycarbtn').addEventListener('click', function () {
        showFoodItems('macchiato');
    });

    document.getElementById('hotcocobuycarbtn').addEventListener('click', function () {
        showFoodItems('hotcoco');
    });

    document.getElementById('honeytoastbuycarbtn').addEventListener('click', function () {
        showFoodItems('honeytoast');
    });

    document.getElementById('waffledessertbuycarbtn').addEventListener('click', function () {
        showFoodItems('waffledessert');
    });

    document.getElementById('souffledessertbuycarbtn').addEventListener('click', function () {
        showFoodItems('souffledessert');
    });

    document.getElementById('friebuycarbtn').addEventListener('click', function () {
        showFoodItems('frie');
    });

    document.getElementById('eggtartbuycarbtn').addEventListener('click', function () {
        showFoodItems('eggtart');
    });

    document.getElementById('icecreambuycarbtn').addEventListener('click', function () {
        showFoodItems('icecream');
    });

   
    var flytime = document.getElementById('flytime');
    var shstime = document.getElementById('shstime').value;


    $(document).ready(function () {
        flytime.innerText = shstime;
        setInterval(function () {
            if (shstime > 0) {
                shstime--;
                document.getElementById('order').innerText = '等待';
                document.getElementById('order').disabled = true;
                omuricebuycarbtn.disabled = true;
                bakedricebuycarbtn.disabled = true;
                melaleucabuycarbtn.disabled = true;
                pizzabuycarbtn.disabled = true;
                pastabuycarbtn.disabled = true;
                stewbuycarbtn.disabled = true;
                omuricecombobuycarbtn.disabled = true;
                muffinbuycarbtn.disabled = true;
                soufflebuycarbtn.disabled = true;
                cakebuycarbtn.disabled = true;
                pastacombobuycarbtn.disabled = true;
                sundaebuycarbtn.disabled = true;
                blackteabuycarbtn.disabled = true;
                americanbuycarbtn.disabled = true;
                lattebuycarbtn.disabled = true;
                cappuccinobuycarbtn.disabled = true;
                macchiatobuycarbtn.disabled = true;
                hotcocobuycarbtn.disabled = true;
                honeytoastbuycarbtn.disabled = true;
                waffledessertbuycarbtn.disabled = true;
                souffledessertbuycarbtn.disabled = true;
                friebuycarbtn.disabled = true;
                eggtartbuycarbtn.disabled = true;
                icecreambuycarbtn.disabled = true;


               
                omuricebuycarbtn.innerText = '等待';
                bakedricebuycarbtn.innerText = '等待';
                melaleucabuycarbtn.innerText = '等待';
                pizzabuycarbtn.innerText = '等待';
                pastabuycarbtn.innerText = '等待';
                stewbuycarbtn.innerText = '等待';
                omuricecombobuycarbtn.innerText = '等待';
                muffinbuycarbtn.innerText = '等待';
                soufflebuycarbtn.innerText = '等待';
                cakebuycarbtn.innerText = '等待';
                pastacombobuycarbtn.innerText = '等待';
                sundaebuycarbtn.innerText = '等待';
                blackteabuycarbtn.innerText = '等待';
                americanbuycarbtn.innerText = '等待';
                lattebuycarbtn.innerText = '等待';
                cappuccinobuycarbtn.innerText = '等待';
                macchiatobuycarbtn.innerText = '等待';
                hotcocobuycarbtn.innerText = '等待';
                honeytoastbuycarbtn.innerText = '等待';
                waffledessertbuycarbtn.innerText = '等待';
                souffledessertbuycarbtn.innerText = '等待';
                friebuycarbtn.innerText = '等待';
                eggtartbuycarbtn.innerText = '等待';
                icecreambuycarbtn.innerText = '等待';





                omuricebuycarbtn.style.backgroundColor = 'gray';
                bakedricebuycarbtn.style.backgroundColor = 'gray';
                melaleucabuycarbtn.style.backgroundColor = 'gray';
                pizzabuycarbtn.style.backgroundColor = 'gray';
                pastabuycarbtn.style.backgroundColor = 'gray';
                stewbuycarbtn.style.backgroundColor = 'gray';
                omuricecombobuycarbtn.style.backgroundColor = 'gray';
                muffinbuycarbtn.style.backgroundColor = 'gray';
                soufflebuycarbtn.style.backgroundColor = 'gray';
                cakebuycarbtn.style.backgroundColor = 'gray';
                pastacombobuycarbtn.style.backgroundColor = 'gray';
                sundaebuycarbtn.style.backgroundColor = 'gray';
                blackteabuycarbtn.style.backgroundColor = 'gray';
                americanbuycarbtn.style.backgroundColor = 'gray';
                lattebuycarbtn.style.backgroundColor = 'gray';
                cappuccinobuycarbtn.style.backgroundColor = 'gray';
                macchiatobuycarbtn.style.backgroundColor = 'gray';
                hotcocobuycarbtn.style.backgroundColor = 'gray';
                honeytoastbuycarbtn.style.backgroundColor = 'gray';
                waffledessertbuycarbtn.style.backgroundColor = 'gray';
                souffledessertbuycarbtn.style.backgroundColor = 'gray';
                friebuycarbtn.style.backgroundColor = 'gray';
                eggtartbuycarbtn.style.backgroundColor = 'gray';
                icecreambuycarbtn.style.backgroundColor = 'gray';




                flytime.innerText = shstime + '秒';
            } else if (shstime == 0 && document.getElementById('order').innerText == '等待') {
                document.getElementById('order').innerText = '買單';
                document.getElementById('order').disabled = false;
                omuricebuycarbtn.disabled = false;
                bakedricebuycarbtn.disabled = false;
                melaleucabuycarbtn.disabled = false;
                pizzabuycarbtn.disabled = false;
                pastabuycarbtn.disabled = false;
                stewbuycarbtn.disabled = false;
                omuricecombobuycarbtn.disabled = false;
                muffinbuycarbtn.disabled = false;
                soufflebuycarbtn.disabled = false;
                cakebuycarbtn.disabled = false;
                pastacombobuycarbtn.disabled = false;
                sundaebuycarbtn.disabled = false;
                blackteabuycarbtn.disabled = false;
                americanbuycarbtn.disabled = false;
                lattebuycarbtn.disabled = false;
                cappuccinobuycarbtn.disabled = false;
                macchiatobuycarbtn.disabled = false;
                hotcocobuycarbtn.disabled = false;
                honeytoastbuycarbtn.disabled = false;
                waffledessertbuycarbtn.disabled = false;
                souffledessertbuycarbtn.disabled = false;
                friebuycarbtn.disabled = false;
                eggtartbuycarbtn.disabled = false;
                icecreambuycarbtn.disabled = false;




                omuricebuycarbtn.innerText = '加入購物車';
                bakedricebuycarbtn.innerText = '加入購物車';
                melaleucabuycarbtn.innerText = '加入購物車';
                pizzabuycarbtn.innerText = '加入購物車';
                pastabuycarbtn.innerText = '加入購物車';
                stewbuycarbtn.innerText = '加入購物車';
                omuricecombobuycarbtn.innerText = '加入購物車';
                muffinbuycarbtn.innerText = '加入購物車';
                soufflebuycarbtn.innerText = '加入購物車';
                cakebuycarbtn.innerText = '加入購物車';
                pastacombobuycarbtn.innerText = '加入購物車';
                sundaebuycarbtn.innerText = '加入購物車';
                blackteabuycarbtn.innerText = '加入購物車';
                americanbuycarbtn.innerText = '加入購物車';
                lattebuycarbtn.innerText = '加入購物車';
                cappuccinobuycarbtn.innerText = '加入購物車';
                macchiatobuycarbtn.innerText = '加入購物車';
                hotcocobuycarbtn.innerText = '加入購物車';
                honeytoastbuycarbtn.innerText = '加入購物車';
                waffledessertbuycarbtn.innerText = '加入購物車';
                souffledessertbuycarbtn.innerText = '加入購物車';
                friebuycarbtn.innerText = '加入購物車';
                eggtartbuycarbtn.innerText = '加入購物車';
                icecreambuycarbtn.innerText = '加入購物車';




                omuricebuycarbtn.style.backgroundColor = '#571e9d';
                bakedricebuycarbtn.style.backgroundColor = '#571e9d';
                melaleucabuycarbtn.style.backgroundColor = '#571e9d';
                pizzabuycarbtn.style.backgroundColor = '#571e9d';
                pastabuycarbtn.style.backgroundColor = '#571e9d';
                stewbuycarbtn.style.backgroundColor = '#571e9d';
                omuricecombobuycarbtn.style.backgroundColor = '#571e9d';
                muffinbuycarbtn.style.backgroundColor = '#571e9d';
                soufflebuycarbtn.style.backgroundColor = '#571e9d';
                cakebuycarbtn.style.backgroundColor = '#571e9d';
                pastacombobuycarbtn.style.backgroundColor = '#571e9d';
                sundaebuycarbtn.style.backgroundColor = '#571e9d';
                blackteabuycarbtn.style.backgroundColor = '#571e9d';
                americanbuycarbtn.style.backgroundColor = '#571e9d';
                lattebuycarbtn.style.backgroundColor = '#571e9d';
                cappuccinobuycarbtn.style.backgroundColor = '#571e9d';
                macchiatobuycarbtn.style.backgroundColor = '#571e9d';
                hotcocobuycarbtn.style.backgroundColor = '#571e9d';
                honeytoastbuycarbtn.style.backgroundColor = '#571e9d';
                waffledessertbuycarbtn.style.backgroundColor = '#571e9d';
                souffledessertbuycarbtn.style.backgroundColor = '#571e9d';
                friebuycarbtn.style.backgroundColor = '#571e9d';
                eggtartbuycarbtn.style.backgroundColor = '#571e9d';
                icecreambuycarbtn.style.backgroundColor = '#571e9d';



                
                clearInterval();

                document.getElementById('flytime').style.display = 'none';

                alert('餐點完成');
            }
        }, 1000);
    });


    // Add event listener for the order button if needed
    document.getElementById('order').addEventListener('click', function () {


        var totalAmount = calculateTotalAmount();
        var totalPrepTime = calculateTotalPrepTime();

        if (totalPrepTime >= 60) {
            totalPrepTime = parseInt(totalPrepTime / 60) + '分鐘' + (totalPrepTime % 60) + '秒';
        } else {
            totalPrepTime = totalPrepTime + '秒';
        }
        alert('總金額：$' + totalAmount);
        alert('時間：' + totalPrepTime);

    });
});
/*=====================================購物車功能結束=========================================*/




























