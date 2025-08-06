function redirect(str)
{
	let hhref = window.location.href;
	let main_split = hhref.split('?');
	let href = "";
	let new_href = main_split[0].split('/');
	new_href[new_href.length - 1] = str + ".html";
    for (let i = 0; i < new_href.length; i++)
    {
        href += (new_href[i] + '/');
    }
    href = href.slice(0, -1);
    console.log(href);
    href += '?';
    href += main_split[1];
    //href = save_to_local(href);
    window.location.href = href;
	//window.location.href = str + ".html";
}