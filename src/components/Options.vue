<template>
  <Loader v-if="store.loading"></Loader>
  <div v-else
    class="bg-fixed min-h-screen h-screen"
    style="background-image:url('https://png.pngtree.com/thumb_back/fw800/background/20220118/pngtree-test-concept-wooden-letterpress-type-type-quiz-challenge-photo-image_21118636.jpg');background-repeat: no-repeat;background-size:cover;"
  >
  <div 
      class="w-11/12 mx-auto grid grid-cols-1 gap-y-8 lg:w-5/12"
  >

    <div class="flex w-full justify-center items-center">
        <img :src="'../../src/assets/logo.png'" class="max-w-xs">
    </div>

    <div class="mt-1 relative"> 
        <input
           type="text"
           placeholder="Type your username..."
           v-model="store.username"
           class="relative w-full bg-white border border-gray-300 rounded-md shadow-md pl-3 pr-10 py-4 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
    </div>

    <div class="mt-1 relative bg-white p-6 rounded-lg" v-if="store.username.length>3">
          <div class="relative">Please, choose a category {{currentCategory}}</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div v-for="(category,i) in availableCategories" :key="i" class="col-sm-6">   
                   <figure
                       @click="selectCategory(category.id)"
                       class="transition ease-in-out delay-150 relative max-w-md mx-auto duration-300 cursor-pointer filter h-200"
                   >
                       <img class="rounded-lg object-none" :src="category.picture" alt="image description">
                       <figcaption class="absolute px-4 text-lg text-black bottom-6 border-gray-300 bg-gray-50">
                           <p>{{category.title}}</p>
                       </figcaption>
                   </figure>
               </div>
           </div>
    </div>

  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid';
import Loader from './Loader.vue';
import { store } from '.././store';

const availableCategories = ref(null);
const currentCategory = ref();

onMounted(() => {
  const headers = { "Content-Type": "application/json", "Accept":"application/json" };
  fetch('https://quizz-api.xtipper.com/api/categories', {headers})
    .then((data) => data.json())
    .then((data) => {
      availableCategories.value = data;
      store.loading = false;
    });
});

const selectCategory = (id) => {
    currentCategory.value = id;
    store.startQuiz({
        category: currentCategory,
    });
    store.checkPlayerId();
};

</script>

