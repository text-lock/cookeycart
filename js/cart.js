//Products are in container with id="ProductList"
//Product item in container with class="product"
//Cart icon clock inthe container width id="Cart"

/*Config*/
//HTML id of the top cart button
var flash_cart_container = "#flash_cart";
//HTML id of the catalog
var catalog_container = "#catalog";
//HTML class of the each product
var product_container = ".product";


//button Add to cart caption
var str_to_cart = "Add to cart";	
//Product column count on #catalog page
var product_row = 4;
//Local curency
var currency = "Руб";

//Checkout config
var email = "";
var name = "";
var subject = ""

/*===End Config===*/

/***********************************/
//Product properties
var product = {		//
	//setters
	setId: function(data){
		return this.id = data},
	setTitle: function(data){
		return this.title = data},
	setDescription: function(data){
		return this.description = data},
	setImage: function(data){
		return this.image = data},
	setPrice: function(data){
		return this.price = data},
	setSale: function(data){
		return this.sale = data},	
	//getters	
	//Get % of discount
	getDiscount: function(product){
		return 100-Math.round(product.sale/product.price*100);
	},

	//Draw price if sale
	getPriceBlock: function(){
		var sale_block;
		var discount;
		var action_block;

		if (this.sale){
			sale_block = '<span class="pc_sale">'+this.sale+' '+currency+'</span>';
			discount = 'discount';
		}
		else {sale_block = ''; discount = '';}
		
		if (this.price){
			price_block = '<span class="pc_price '+discount+'">'+this.price+' '+currency+'</span>'
				
			action_block = '<div class="pc_action">'+
				'<input class="count" type="text" value="1" name="count" pid='+this.id+' >'+
				'<button class="add_to_cart btn-success btn-lg" pid='+this.id+'>'+str_to_cart+'</button></div>';
		}
		else {price_block = ''; action_block = '';}

		return this.priceBlock = price_block+sale_block+action_block;
	}
}

//Cart properties
var cart = {
	products: new Array(),
	total: 0,					//total price of the cart;
	count: 0,					//total products count in the cart
	//Draw price section
	getPriceBlock: function(product){
		var sale_block;
		var discount;
		var action_block;

		if (product.sale){
			sale_block = '<span class="pc_sale">'+product.sale+' '+currency+'</span>';
			discount = 'discount';
		}
		else {sale_block = ''; discount = '';}
		
		if (product.price)
			price_block = '<span class="pc_price '+discount+'">'+product.price+' '+currency+'</span>';
		else price_block = '';

		return  price_block+sale_block;
	},

	//Saves products to cart (update cookies)
	updateCart: function(){
		var cc = this;

		this.products.forEach(function(value, index){
			if (value.qnty == 0) delete(cc.products[index]);
		})

		document.cookie = "cart="+JSON.stringify(this.products);
		document.cookie = "count="+this.count;
		document.cookie = "total="+this.total;
		this.initCart();
	},
	
	//Reads cart data from cookies 
	initCart: function(){
		var productsInCart;
		var tempList = [];

		//Get total price and product count in the cart
		if (parseInt(getCookie('total'))) this.total = parseInt(getCookie('total'));
		else this.total = 0;
		if (parseInt(getCookie('count'))) this.count = parseInt(getCookie('count'));
		else this.count = 0;	
		
		//Set count&price data to header
		$("#cart_total_count").html('('+this.count+')');
		$("#cart_total_price").html(': '+this.total+' '+ currency);	
		
		//Get cart product list fom the cookies 
		if (getCookie('cart')) productsInCart = JSON.parse(getCookie('cart'));	
		if (productsInCart)	productsInCart.forEach(function(item, i) {
								if(item) tempList.push(item);	
							});	
		this.products = tempList;
	},

	//Search product in cart by ID
	getProductById: function(product_id){
		var init = false;
		this.products.forEach(function(value){
			if (value.id == product_id) {
				init = value
			}
		});
		return init;
	},

	addProductToCart: function(product, qnt){
		//Get product price
		if (product.sale) this.total = parseInt(this.total) + parseInt(product.sale)*qnt;
		else this.total = parseInt(this.total) + parseInt(product.price)*qnt;
		
		//Get product qnty in the cart
		this.count = parseInt(this.count) + parseInt(qnt);

		//Check product in the cart
		if(!this.getProductById(product.id)){
			this.products.push(product);
			this.getProductById(product.id).qnty = 1;
		}else
			this.getProductById(product.id).qnty = parseInt(this.getProductById(product.id).qnty) + 1;

		this.updateCart();
	},
	
	delProductFromCart: function(product, qnt = 1){
		//when product count in the cart > 1
		if (product.qnty > 1 && qnt < product.qnty && qnt != 0){
			//Check discount
			if (product.sale) this.total = parseInt(this.total) - parseInt(product.sale)*qnt;
			else this.total = parseInt(this.total) - parseInt(product.price)*qnt;
			this.count = parseInt(this.count) - parseInt(qnt);
			this.products.forEach(function(value, index){
				if (value.id == product.id) value.qnty = value.qnty - 1;
			});
		}
		else if (qnt == 0 || this.getProductById(product.id).qnty == 1){
			this.count = parseInt(this.count) - parseInt(product.qnty);
			if (product.sale) this.total = parseInt(this.total) - parseInt(product.sale)*product.qnty;
			else this.total = parseInt(this.total) - parseInt(product.price)*product.qnty;
			product.qnty = 0;
		}

		this.updateCart();
	},
	


	Show: function(){
		
		var current_cart = this;
		
		var html='<h2>Shopping cart</h2><table class="table table-striped"><thead><tr>'+
						'<th>Title</th><th>Qnty</th><th>Action</th><th>Price</th><th>Total</th></tr></thead>'+
						'<tbody>';
		var total_sale_price = 0;
		var cart_data = this;
		this.products.forEach(function(value, index){
			var total;

			if (!value.sale) total = value.qnty*value.price;
			else total = value.qnty*value.sale;
			//console.log(total);
			html += '<tr><td>'+value.title+'</td><td><span>'+value.qnty+'</span><sup pid='+value.id+' class="incQnty">+</sup>/<sub class="decQnty" pid='+value.id+'>-</sub></td>'+
					'<td pid='+value.id+' class="cart_product_delete">'+' x '+'</td><td>'+cart_data.getPriceBlock(value)+'<td>'+
					'<td pid='+value.id+' class="cart_product_total">'+total+' '+currency+'</td></tr>';
		});

		html += '<tr><td></td><td></td><td></td><td>total:</td><td id="cart_total">'+this.total+'</td></tr></tbody></table>';
		$("#scart_data_popup div").html(html);

		//increase product qnty in the cart
		$("sup.incQnty").click(function(){
			var pid = $(this).attr("pid");
			current_cart.addProductToCart(current_cart.getProductById(pid), 1);	
			current_cart.Show();
		});

		//decrease product qnty in the cart
		$("sub.decQnty").click(function(){
			var pid = $(this).attr("pid");
			current_cart.delProductFromCart(current_cart.getProductById(pid));	
			current_cart.Show();
		});
		//Delete product from cart
		$(".cart_product_delete").click(function(){
			var pid = $(this).attr("pid");			
			current_cart.delProductFromCart(current_cart.getProductById(pid), 0);	
			current_cart.Show();
		});

	},

}

var catalog = {
	products: new Array(),
	
	getProduct: function(product_id){
		var init = false;
		this.products.forEach(function(value){
			if (value.id == product_id) init = value
		});
		return init;
	},

	Show: function(product){
		var html_description = '';
					
		html_description = 
			'<div class="col-md-6"><div class="pc_image"><img src="'+product.image+'" class="img-thumbnail"></div></div>'+
			'<div class="col-md-6"><div class="pc_title"><h2>'+product.title+'</h2></div>'+
				'<div class="pc_description"><p>'+product.description+'</p></div>'+product.getPriceBlock()+'</div>';
		
		return  html_description;

	}
}
jQuery( document ).ready(function( $ ) {

	//add catalog and data popUP
	$('body').append('<div id="scart_overlay" class="popup"></div>');
	$('body').append('<div id="scart_data_popup" class="popup"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button><div></div></div>');
	
	//bootstraping catalog
	$(".product").addClass('col-md-'+product_row);
	$(".product .image img").addClass('img-thumbnail');

	//Generate product list
	catalog.products = initProductList(product_container);

	//Show product card
	$(product_container+' .title').click(function(){
		var id = $(this).parent('.product').attr("pid");
		$("#scart_overlay").css('display','block');
		$("#scart_data_popup").css('display','block');

		$("#scart_data_popup div").html(catalog.Show(catalog.getProduct(id)));
	});
	
	//Show product card via Title click;
	$(product_container+' .title').click(function(){
		var id = $(this).parent('.product').attr("pid");
		$("#scart_overlay").css('display','block');
		$("#scart_data_popup").css('display','block');
		$("#scart_data_popup div").html(catalog.Show(catalog.getProduct(id)));
		
		$(".add_to_cart").click(function(){
			var id = $(this).attr("pid");
			var qnt = $('[name="count"][pid='+id+']').val();
			cart.addProductToCart(catalog.getProduct(id), qnt);	
		});	
	});
		

	//Close all popups
	$('.close').click(function(){
		$(".popup").hide();
	});
	
	$("#scart_overlay").click(function(){
		$(".popup").css('display','none');
	});
	
	//Add to cart
	$(".add_to_cart").click(function(){
		var id = $(this).attr("pid");
		cart.addProductToCart(catalog.getProduct(id), 1);
	});
	
	//Cart modal init
	$("#cart_show_modal").click(function(){

		$("#scart_overlay").css('display','block');
		$("#scart_data_popup").css('display','block');

		cart.Show();
				
		
	});
});

function checkOut(){

}

function initProductList(pc){
	var products = new Array();
	
	$(pc).each(function( index, value ){

		var tempProduct = Object.create(product);
		var p_title = $(this).find('.title');
		var p_description = $(this).find('.description');
		var p_price = $(this).find('.price');
		var p_sale = $(this).find('.sale');
		var p_image = $(this).find('img');
		
		var price = parseFloat(p_price.html());
		var sale = parseFloat(p_sale.html());
		var title = p_title.html();
		var description = p_description.html();
		var image = p_image.attr("src");
		
		tempProduct.setId(index);
		tempProduct.setTitle(title);
		tempProduct.setDescription(description);
		tempProduct.setImage(image);
		if (price) tempProduct.setPrice(price);
		if (sale) tempProduct.setSale(sale);

		$(this).attr('pid', tempProduct.id);
		p_description.css('display','none');
		$(p_price).append(currency);
		$(p_sale).append(currency);
		if (sale){ $(p_price).addClass('discount');
			$(this).append('<div class="percents">-'+tempProduct.getDiscount(tempProduct)+'%</div>');
		}
	
		if(price){
			$(this).append('<button class="add_to_cart btn-success btn-sm" pid='+tempProduct.id+'>'+str_to_cart+'</button>');
		}
	
		products.push(tempProduct);
	});
	
	
	cart.initCart(products);
	
	
	return products;
	
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}