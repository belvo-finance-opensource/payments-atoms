<template>
  <ul class="belvo-payments-grid">
    <li
      v-for="institution in institutionsByCountry"
      :key="institution.id"
      :class="cardClasses(institution.id)"
      @click="onClick(institution)"
    >
      <img :src="institution.icon_logo" />
      <span>{{ institution.display_name }}</span>
    </li>

    <li
      :class="cardClasses()"
      class="belvo-payments-grid__card--another-institution"
      @click="onClick()"
    >
      <span>{{ anotherInstitutionText }}</span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import institutionsData from '@/data/institutions.json'
import BelvoPaymentsAtomsOptions from '@/features/options/BelvoPaymentsAtomsOptions'
import type { Country, Institution } from '@/types/lib'
import { Institutions } from '@/types/lib'
import { PropType, computed, ref } from 'vue'

const props = defineProps({
  country: {
    type: String as PropType<Country>,
    default: 'COL'
  },
  anotherInstitutionText: {
    type: String,
    default: 'Another institution'
  }
})

const belvoPaymentsAtomsOptions = BelvoPaymentsAtomsOptions.getInstance()
const institutions = institutionsData as Institutions
const selectedInstitutionId = ref<string | undefined>('')
const institutionsByCountry = computed(() => institutions[props.country])

const cardClasses = (institutionId?: Institution['id']) => {
  return [
    { 'belvo-payments-grid__card': true },
    { 'belvo-payments-grid__card--selected': selectedInstitutionId.value === institutionId }
  ]
}

const onClick = (institution?: Institution) => {
  selectedInstitutionId.value = institution?.id

  belvoPaymentsAtomsOptions.options?.bankShortcuts?.callback(institution)
}
</script>

<style lang="scss" src="./BelvoPaymentsGrid.scss" scoped />
