const $cupcakes_list = $('#cupcakes');
const $form = $('#add');
const $edit = $('#edit');
const $editBtn = $('#edit_btn');
const $flavor = $('#add #flavor');
const $size = $('#add #size');
const $rating = $('#add #rating');
const $img_url = $('#add #url');
const $flavorEdit = $('#edit #flavor');
const $sizeEdit = $('#edit #size');
const $ratingEdit = $('#edit #rating');
const $img_urlEdit = $('#edit #url');
const $searchBox = $('#search-box');

function generateCupcakeMarkup(cupcake) {
    return `
      <div data-id=${cupcake.id}>
        <li id=${cupcake.id}>
          Flavor: ${cupcake.flavor} | Size: ${cupcake.size} | Rating: ${cupcake.rating}
          <button class="edit-cupcake">Edit</button>
          <button class="delete-cupcake">X</button>
        </li>
        <img class="Cupcake-img"
              src="${cupcake.image}"
              alt="(no image provided)">
      </div>
    `;
  }


$($cupcakes_list).on('click', '.edit-cupcake', function(evt){
        evt.preventDefault();
        const id = $(this).closest('div').data('id');
        showEditForm(id);
});



$($cupcakes_list).on('click', '.delete-cupcake', async function(evt){
        evt.preventDefault();
        const $cupcake = $(this).closest('div');
        const id = $cupcake.data('id');
        
        await axios.delete(`/api/cupcakes/${id}`);
        $cupcake.remove();
})


async function get_cupcakes() {
    const get_list = await axios.get('/api/cupcakes')
    show_cupcakes(get_list.data.cupcakes)
};

function show_cupcakes(cupcake_list) {
    $cupcakes_list.empty();
    for(let cupcake of cupcake_list){
        const cupcake_markup = generateCupcakeMarkup(cupcake);
        $cupcakes_list.append(cupcake_markup);
    }
};

async function showEditForm(id) {
    $form.hide();
    $edit.show();
    const cupcake = await axios.get(`/api/cupcakes/${id}`)
   
    $flavorEdit.val(cupcake.data.cupcake.flavor)
    $sizeEdit.val(cupcake.data.cupcake.size)
    $ratingEdit.val(cupcake.data.cupcake.rating)
    $img_urlEdit.val(cupcake.data.cupcake.img_url)
    console.log(id)
    $editBtn.attr('data-id', id);
};

async function patch_cupcake(e) {
    e.preventDefault();

    const cup_id = $editBtn.attr('data-id');
    
    const flavor = $flavorEdit.val();
    const size = $sizeEdit.val();
    const rating = $ratingEdit.val();
    const img_url = $img_urlEdit.val();

    $form.trigger('reset');
    
    const add = await axios.patch(`/api/cupcakes/${cup_id}`, {'flavor':flavor, 'size': size, 'rating':rating, 'image':img_url})
    
    const listItem = $(`#${cup_id}`);
    listItem.closest('div').remove();
    const cupcake_markup = generateCupcakeMarkup(add.data.cupcake);
    $cupcakes_list.append(cupcake_markup);
    $edit.hide();
    $form.show();
}

$edit.on('submit', patch_cupcake);


async function add_cupcake(e) {
    e.preventDefault();

    const flavor =$flavor.val();
    const size = $size.val();
    const rating = $rating.val();
    const img_url = $img_url.val();

    $form.trigger('reset');
    
    
    const add = await axios.post('/api/cupcakes', {'flavor':flavor, 'size': size, 'rating':rating, 'image':img_url})
    const cupcake_markup = generateCupcakeMarkup(add);
    $cupcakes_list.append(cupcake_markup);
}

$form.on('submit', add_cupcake);

async function searchCupcake(e) {
    e.preventDefault();

    let searchVal = $searchBox.val();
    const get_list = await axios.get('/api/cupcakes/search', {params: {search: searchVal}})
    
    show_cupcakes(get_list.data.cupcakes)

};
$searchBox.on('keyup', searchCupcake);

$(document).ready(function() {
    get_cupcakes();
    $edit.hide();
});