<html>
<head>
	<title>Cookeycart</title>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<link rel="stylesheet" href="css/bootstrap.icon-large.min.css">
	<link rel="stylesheet" href="css/cart.css">

	<!-- jQuery library -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

	<!-- Latest compiled JavaScript -->
	<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script src="js/cart.js"></script>
	
</head>
<body>
	<header>
		<nav class="navbar navbar-inverse">
		  <div class="container">
			<div class="navbar-header">
				<a href="#" class="btn btn-info btn-lg" id="cart_show_modal">
					<span class="glyphicon glyphicon-shopping-cart"></span> Shopping Cart
					<span id="cart_total_price"></span>
					<span id="cart_total_count"></span>
				</a>
			</div>
		  </div>
		</nav>
	</header>
	<div class="container">
		<section id="catalog" >
			<div class="product">
				<div class="image">
					<img src="img/01.jpg">
				</div>
				<h4 class="title">
					Item 1
				</h4>
				<div class="description">
					Description of Item 1
				</div>	
				<span class="price">
					195.99
				</span>
				<span class="sale">
					180
				</span>		
			</div>
			<div class="product">
				<div class="image">
					<img class="img-thumbnail" src="img/02.jpg">
				</div>
				<h4 class="title">
					Item 2
				</h4>
				<div class="description">
					Description of Item 2
				</div>
				<span class="price">
					200
				</span>
			</div>
			<div class="product">
				<div class="image">
					<img class="img-thumbnail" src="img/03.jpg">
				</div>
				<h4 class="title">
					Item 3
				</h4>
				<div class="description">
					Description of Item 3
				</div>	
				<span class="price">
					100
				</span>
			</div>
		</section>
	</div>
</body>
</html>