const { createApp, ref, onMounted } = Vue

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup() {
    const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
    const apiPath = 'liquor_store';
    const products = ref([]);
    const status = ref(false);
    const tempProduct = ref({
      imagesUrl: [],
    });

    const checkAdmin = () => {
      axios.post(`${apiUrl}/api/user/check`)
        .then(() => {
          getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'index.html';
        });
    };

    const getData = () => {
      axios.get(`${apiUrl}/api/${apiPath}/admin/products/all`)
        .then((response) => {
          products.value = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const updateProduct = () => {
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = 'post';

      if (!status.value) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`;
        http = 'put';
      }

      axios[http](url, { data: tempProduct.value })
        .then((response) => {
          alert(response.data.message);
          productModal.hide();
          getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const showModal = (isNew, item) => {
      if (isNew === 'new') {
        tempProduct.value = {
          imagesUrl: [],
        };
        status.value = true;
        productModal.show();
      } else if (isNew === 'edit') {
        tempProduct.value = { ...item };
        status.value = false;
        productModal.show();
      } else if (isNew === 'delete') {
        tempProduct.value = { ...item };
        delProductModal.show();
      }
    };

    const delProduct = () => {

      axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`)
        .then((response) => {
          alert(response.data.message);
          delProductModal.hide();
          getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const createImages = () => {
      tempProduct.value.imagesUrl = [];
      tempProduct.value.imagesUrl.push('');
    };

    onMounted(() => {
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,
      });

      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
      });

      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;

      checkAdmin();
    });

    return {
      products,
      status,
      tempProduct,
      updateProduct,
      showModal,
      delProduct,
      createImages,
    };
  },
})
app.mount('#app');