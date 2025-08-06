//logical representation of a product. It conains name price and image of the product
class Product
{
	#name;
	#price;
	#image;
	constructor(name, price, image)
	{
		this.#name = name;
		this.#price = price;
		this.#image = image;
	}
	// getters of the class
	get_name()
	{
		return this.#name;
	}

	get_price()
	{
		return this.#price;
	}

	get_image()
	{
		return this.#image;
	}
}

// logical representation of the div containing the product
class ProductWrapper extends Product
{
	#number;
	#total_price;
	constructor(prod, obj)
	{
		//works if product is defined
		if (prod != null)
		{
			super(prod.get_name(), prod.get_price(), prod.get_image());
			this.#number = 1;
			this.#total_price = prod.get_price();
			this.#total_price = Math.round(this.#total_price * 100) / 100;
		}
		else
		{
			// works if it is not
			super(obj.name, obj.price, obj.image);
			this.#number = obj.number;
			this.#total_price = obj.number * obj.price;
			this.#total_price = Math.round(this.#total_price * 100) / 100;
		}
	}

	//Internally modifies class when addin a product
	add_item()
	{
		this.#number++;
		this.#total_price += this.get_price();
		this.#total_price = Math.round(this.#total_price * 100) / 100;
		return {number: this.#number, total_price: this.#total_price};
	}

	//Internally modifies class when removing a product
	remove_item()
	{
		this.#number--;
		this.#total_price -= this.get_price();
		this.#total_price = Math.round(this.#total_price * 100) / 100;
		return {number: this.#number, total_price: this.#total_price};
	}

	//getters of the class
	get_total_price()
	{
		return this.#total_price;
	}

	get_number()
	{
		return this.#number;
	}

	//checks whether the title of the product is the same
	is_same(p)
	{
		return p.get_name() == this.get_name();
	}

	//checks whether all initial parameter are the same
	is_copy(p)
	{
		return this.is_same(p) && this.get_price() == p.get_price() && this.get_number() == p.get_number();
	}
}


// an array to store data of all products (temporary storage)
var products = [];

//this is a function that activates after pressing "add to cart" button on the Product page
function add_item(p)
{
	for (let i = 0; i < products.length; i++)
	{
		if (products[i].is_same(p))
		{
			products[i].add_item();
			return;
		}
	}
	products[products.length] = new ProductWrapper(p);
}

// Saves all data after leaving page
function save_to_local(href)
{
	let url = new URL(href);
	let url_par = new URLSearchParams(url.search);
    for (let i = 0; i < products.length; i++)
    {

        let obj = {
        name: products[i].get_name(),
        image: products[i].get_image(),
        price: products[i].get_price(),
        number: products[i].get_number()
        };
    	url_par.set(products[i].get_name(), JSON.stringify(obj));
    }
    url.search = url_par.toString();
    return url.href;
}


// retrieves data from the memory
function retrieve_from_local()
{
	let url = new URL(window.location.href);
	let url_par	= new URLSearchParams(url.search);
	let keys = url_par.keys();
	console.log(keys);
	for (let el of keys)
	{
		let item = url_par.get(el);
		let pw = new ProductWrapper(null, JSON.parse(item));
		products.push(pw);
		console.log(item);
	}
}

// this is the function that is called when a plus button is pressed in the cart page
function add(id)
{
	let new_num = document.querySelector(id + " .dnum").innerHTML;
	let new_price = document.querySelector(id + " .dprice").innerHTML;
	let price_per_one = (new_price/new_num);
	new_num++;
	//creating a new product object after increasing its number
	let obj = {
		name: document.querySelector(id + " .dname").innerHTML,
		image: document.querySelector(id + " img").src,
		number: new_num,
		price: price_per_one,
	};

	let npw = new ProductWrapper(null, obj);
	//sending product wrapper to the main system object
	sys.modify_node(npw);
}

// this is the function that is called when a minus button is pressed in the cart page
function remove(id)
{
	//similar structure as in add(id)
	let new_num = document.querySelector(id + " .dnum").innerHTML;
	let new_price = document.querySelector(id + " .dprice").innerHTML;
	let price_per_one = (new_price/new_num);
	new_num--;
	let obj = {
		name: document.querySelector(id + " .dname").innerHTML,
		image: document.querySelector(id + " img").src,
		number: new_num,
		price: price_per_one,
	};

	let npw = new ProductWrapper(null, obj);
	console.log(npw);
	sys.modify_node(npw);
}

//clears all local storage apart from comment section
function clear()
{
	let keys = Object.keys(localStorage);
	for (let i = 0; i < keys.length; i++)
	{
		if (keys[i].substring(0, 4) != "comm")
		{
			localStorage.removeItem(keys[i]);
		}
	}
}

//the physical representation of the HTML div element
class NodeItem
{
	#pw;
	#node;
	#main_el = document.getElementById("code_area");
	#new_name
	constructor(pw)
	{
		this.#pw = pw;
		this.#new_name = this.#pw.get_name().replace(" ", "-");
	}

	//copies node from the template to the cart page
	create_node()
	{
		//.control_div .controls .dnum
		//console.log(document.querySelectorAll("div"));
		let templ = document.getElementById("prod_templ");
		let new_node = templ.content.cloneNode(true);
		//adds element to the page
		this.#main_el.appendChild(new_node);
		let last_el = document.getElementsByClassName("code_block");
		last_el[last_el.length - 1].id = this.#new_name;
		this.#node = last_el[last_el.length - 1];
		this.#set_node();
	}

	//delete the node from the page
	delete()
	{
		this.#node.remove();
	}

	//sets values of every part of the div on the cart page (uch as name, total price, etc.).
	#set_node()
	{
		let id = '#' + this.#new_name;
		let nname = this.#new_name;
		//setting values to the elements
		document.querySelector(id + " .dnum").innerHTML = this.#pw.get_number();
		document.querySelector(id + " .dname").innerHTML = this.#pw.get_name();
		document.querySelector(id + " .dprice").innerHTML = this.#pw.get_total_price();
		document.querySelector(id + " img").src = this.#pw.get_image();
		console.log(document.querySelector(id + " .plus"));

		//sets events to the buttons
		let pl = document.querySelector(id + " .plus");
		pl.addEventListener("click", function(){add(id);}, false);
		let mn = document.querySelector(id + " .minus");
		mn.addEventListener("click", function(){remove(id);}, false);
	}

	//modifies "dynamic" parameters of the node (i.e. sets them to the value of a given Product Wrapper)
	change_node(new_pw)
	{
		this.#pw = new_pw;
		let id = '#' + this.#new_name;
		document.querySelector(id + " .dnum").innerHTML = this.#pw.get_number();
		document.querySelector(id + " .dname").innerHTML = this.#pw.get_name();
		document.querySelector(id + " .dprice").innerHTML = Math.round(this.#pw.get_total_price() * 100)/100;
	}

	//comparings are ompleted through internal Product Wrappers
	is_same(pw1)
	{
		return this.#pw.is_same(pw1);
	}

	is_equal(pw1)
	{
		return this.#pw.is_copy(pw1);
	}

	//sets the wrapper after the element is constructed
	set_wrap(pw1)
	{
		this.#pw = pw1;
	}
}

//the main class System that operates the whole program 
class System
{
	#node_items = [];
	#main_el = document.getElementById("code_area");
	constructor() 
	{}
	
	//loads all the elements from the products array
	load()
	{
		for (let i = 0; i < products.length; i++)
		{
			let ans = this.#check_existance(products[i]);
			if (!ans.exist)
			{
				let n = new NodeItem(products[i]);
				this.#node_items[this.#node_items.length] = n;
				n.create_node();
			}
		}
		this.#recal_total();
	}

	//changes the existing node 
	modify_node(new_pw)
	{
		let el;
		for (let i = 0; i < this.#node_items.length; i++)
		{
			if (this.#node_items[i].is_same(new_pw))
			{
				el = i;
				//if the number of a prouct is 0 then the node is deleted
				if (new_pw.get_number() == 0)
				{
					this.#node_items[i].delete();
					break;
				}
				//otherwise changes the node on the screen
				this.#node_items[i].change_node(new_pw);
				products[i] = new_pw;
				break;
			}
		}
	// further deletions (from the product array etc.)
		if (new_pw.get_number() == 0)
		{
			this.#node_items.splice(el, 1);
			console.log(this.#node_items);
			for (let i = 0; i < products.length; i++)
			{
				if (products[i].is_same(new_pw))
				{
					localStorage.removeItem(products[i].get_name());
					products.splice(i, 1);
					console.log("I am here");
					console.log(products);
					console.log(Object.keys(localStorage));
					break;
				}
			}
		}
		// recalculates the total price of the purchase
		this.#recal_total();
	}

	//checking all the combinations of is_same/is_copy
	#check_existance(item)
	{
		for (let i = 0; i < this.#node_items.length; i++)
		{
			if (this.#node_items[i].is_same(item))
			{
				if (this.#node_items[i].is_equal(item))
				{
					return {exist: true, equal: true};
				}
				return {exist: true, equal: false};
			}
		}
		return {exist: false, equal: false};
	}

	//simply recalculates total price from the products array
	#recal_total()
	{
		let tot = document.getElementById("total");
		let sum = 0;
		for (let i = 0; i < products.length; i++)
		{
			sum+= products[i].get_total_price();
		}

		tot.innerHTML = "Total: £" + Math.round(sum * 100)/100;
	}
}

var sys = new System();