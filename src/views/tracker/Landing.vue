<template>
  <div style="font-family: Arial, sans-serif; background: #f5f7fa;">
    <!-- Hero -->
    <div style="background: linear-gradient(135deg, #003399 0%, #0055cc 100%); color: white; padding: 60px 20px; text-align: center;">
      <h1 style="font-size: 36px; margin-bottom: 20px;">Flight Compensation Information Platform</h1>
      <p style="font-size: 18px;">Independent flight delay compensation information platform. All compensation services provided by our partner AirHelp</p>
    </div>

    <!-- Main Content -->
    <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
      <!-- Law Section -->
      <div style="background: white; border-radius: 12px; padding: 40px; margin-bottom: 40px;">
        <h2 style="color: #003399; font-size: 28px; margin-bottom: 20px;">⚖️ Legal Basis: EU Regulation 261</h2>
        <p>All eligible flights displayed on this platform are selected based on EU Regulation 261/2004. Compensation ranges from €250 to €600.</p>
      </div>

      <!-- Flight List -->
      <div style="background: white; border-radius: 12px; padding: 40px; margin-bottom: 40px;">
        <h2 style="color: #003399; font-size: 24px; margin-bottom: 30px;">✈️ Eligible Flights</h2>
        
        <!-- Search -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
            <input v-model="search.flightNumber" placeholder="Flight Number" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <input v-model="search.airlineName" placeholder="Airline Name" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <input v-model="search.scheduledDate" type="date" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button @click="resetSearch" style="padding: 10px 25px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">Reset</button>
            <button @click="loadFlights" style="padding: 10px 25px; background: #003399; color: white; border: none; border-radius: 6px; cursor: pointer;">Search</button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" style="text-align: center; padding: 40px;">Loading...</div>

        <!-- Table -->
        <div v-else-if="flights.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
            <colgroup>
              <col style="width: 12%;">
              <col style="width: 20%;">
              <col style="width: 22%;">
              <col style="width: 22%;">
              <col style="width: 24%;">
            </colgroup>
            <thead style="background: #f8f9fa;">
              <tr>
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Flight</th>
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Airline</th>
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Scheduled Departure</th>
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Actual Departure</th>
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in flights" :key="f.id" style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 15px; text-align: left;"><strong>{{ f.flightNumber }}</strong></td>
                <td style="padding: 15px; text-align: left;">{{ f.airlineName }}</td>
                <td style="padding: 15px; text-align: left;">{{ formatDate(f.scheduledDeparture) }}</td>
                <td style="padding: 15px; text-align: left; color: #dc3545;">{{ formatDate(f.actualDeparture) }}</td>
                <td style="padding: 15px; text-align: left;">
                  <button @click="checkClaim" style="background: #003399; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Check Eligibility</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div v-else style="text-align: center; padding: 60px; color: #999;">
          <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
          <p>No eligible flights available</p>
        </div>

        <!-- Pagination -->
        <div v-if="flights.length > 0" style="display: flex; justify-content: space-between; margin-top: 30px; flex-wrap: wrap; gap: 20px;">
          <div>Showing {{ (page * size) + 1 }}-{{ Math.min((page + 1) * size, total) }} of {{ total }} flights</div>
          <div style="display: flex; gap: 10px;">
            <button @click="prevPage" :disabled="page === 0" style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">Previous</button>
            <button @click="nextPage" :disabled="page >= totalPages - 1" style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Button -->
    <a href="#" @click.prevent="checkClaim" style="position: fixed; right: 30px; bottom: 30px; background: #28a745; color: white; padding: 15px 25px; border-radius: 50px; text-decoration: none; box-shadow: 0 4px 20px rgba(40,167,69,0.4);">💬 Check Eligibility</a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { recordButtonClick } from '@/api/tracker';

const route = useRoute();
const shortId = computed(() => route.params.shortId as string || 'demo');

interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  scheduledDeparture: string;
  actualDeparture: string | null;
}

const loading = ref(false);
const flights = ref<Flight[]>([]);
const page = ref(0);
const size = ref(10);
const total = ref(0);
const totalPages = ref(1);
const search = ref({ flightNumber: '', airlineName: '', scheduledDate: '' });

async function loadFlights() {
  try {
    loading.value = true;
    const params: any = { page: page.value, size: size.value };
    if (search.value.flightNumber) params.flightNumber = search.value.flightNumber;
    if (search.value.airlineName) params.airlineName = search.value.airlineName;
    if (search.value.scheduledDate) params.scheduledDepartureDate = search.value.scheduledDate;
    
    const res = await axios.get('/api/flights/search', { params });
    flights.value = res.data.flights;
    page.value = res.data.currentPage;
    total.value = res.data.totalElements;
    totalPages.value = res.data.totalPages;
  } catch (error) {
    console.error('Error loading flights:', error);
    flights.value = [];
  } finally {
    loading.value = false;
  }
}

function resetSearch() {
  search.value = { flightNumber: '', airlineName: '', scheduledDate: '' };
  page.value = 0;
  loadFlights();
}

function prevPage() {
  if (page.value > 0) {
    page.value--;
    loadFlights();
  }
}

function nextPage() {
  if (page.value < totalPages.value - 1) {
    page.value++;
    loadFlights();
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
}

async function checkClaim() {
  try {
    await recordButtonClick(shortId.value);
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Error:', error);
  }
  window.location.href = 'https://airhelp.tpo.li/I23Fh9CN';
}

onMounted(() => {
  loadFlights();
});
</script>
