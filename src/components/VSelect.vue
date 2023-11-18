<!--{{{ Pug -->
<template lang="pug">

//- Generate a list of <option> tags
mixin options(options)
	option(
		v-for=`(optionLabel, optionValue) of ${options}`
		:key="`option--${optionValue}`"

		:value="optionValue"
		:selected="optionValue === value"
	) {{ optionLabel.name || optionLabel }}

mixin options2(options)
	option(
		v-for=`[optionValue, optionLabel] of ${options}`
		:key="`option--${optionValue}`"

		:value="optionValue"
		:selected="optionValue === value"
	) {{ optionLabel.name || optionLabel }}

div.VSelect
	//- Menu
	select.select(
		ref="select"
		:value="value"
		:disabled="isDisabled"

		@change="$emit('change', $event.target.value)"
		)
		//- Grouped options
		template(v-if="Array.isArray(options)")
			optgroup(
				v-for="optionGroup of options"
				:key="`option-group--${optionGroup.label.toLowerCase().replace(/\s+/g, '-')}`"

				:label="optionGroup.label"
				)
				+options("optionGroup.options")

		//- Simple options list
		template(v-else)
			+options2("resortedOptions")

	//- Fake select bar
	div.bar(v-mods="{ isContained, isFirstItem, isLastItem }")

		div.bar__label
			//- Icon
			div.label__icon(v-if="icon.length"): font-awesome-icon(:icon="Array.isArray(icon) ? icon : ['fas', icon]")
			//- Current value
			p.label__text(v-html="selectedOptionLabel")

		//- Chevron
		font-awesome-icon.bar__chevron(:icon="['fas', 'chevron-down']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { formatOrdinalSuffix } from '@/modules/text'

export default {
	name: 'VSelect',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		options: {
			type: [Object, Array],
			required: true,
		},
		resortOptions: {
			type: Boolean,
			default: false,
		},
		value: {
			type: [String, Number],
			required: true,
		},
		icon: {
			type: [Array, String],
			default: '',
		},
		labelPrefix: {
			type: String,
			default: '',
		},
		labelFormatter: {
			type: Function,
			default: (value, label) => label,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isContained: {
			type: Boolean,
			default: false,
		},
		isFirstItem: {
			type: Boolean,
			default: false,
		},
		isLastItem: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			selectedOptionLabel: '',
		}
	},

	computed: {
		resortedOptions() {
			const options = this.options;
			const entries = Object.entries(options);
			if (this.resortOptions) {
				entries.sort( ([firstKey,_firstValue], [secondKey,_secondValue]) => {
					function keyToIndex(key) {
						const num = Number(key);
						if (num === 0) return -2; // swap "whole" and "open"
						if (num === -2) return 0; // 
						if (num === -1) return 100; // send custom to end
						return num;
					}

					const firstKeyNum = keyToIndex(firstKey);
					const secondKeyNum = keyToIndex(secondKey);

					if (!isNaN(firstKey) && !isNaN(secondKey)) {
						return firstKeyNum - secondKeyNum;
					}
					else {
						return firstKey.localeCompare(secondKey);
					}
				});
			}
			return entries;
		}
	},

	watch: {
		value: 'updateSelectedOptionLabel',
	},

	mounted() {
		this.updateSelectedOptionLabel();
	},

	methods: {
		async updateSelectedOptionLabel() {
			await this.$nextTick();
			if (this.$refs.select.selectedOptions.length===0) return;
			const suffix = formatOrdinalSuffix(this.$refs.select.selectedOptions[0].label);
			const label = this.labelFormatter(this.value, suffix);
			this.selectedOptionLabel = `${this.labelPrefix} ${label}`;
		}

	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VSelect {
	display: grid;
}

.select {
	grid-area: 1 / 1;

	padding-right: 20px;

	opacity: 0.0001;

	&:disabled {
		cursor: not-allowed;
	}
}

.bar {
	display: flex;
	align-items: center;
	justify-content: space-between;

	grid-area: 1 / 1;

	padding: 16px 16px 16px 14px;

	color: var(--color--text);

	&.is-contained {
		border-bottom: 1px solid var(--color--bg--highlight);
	}

	&:not(.is-contained) {
		border: 1px solid var(--color--border);
		border-radius: 4px;

		background-color: var(--color--bg);
	}

	.select:disabled + & {
		opacity: 0.5;

		cursor: not-allowed;
	}

	@include mq($from: desktop) {
		padding: 8px 10px;

		.select:not(:disabled):hover + & {
			border-color: var(--color--hover);
			background-color: var(--color--bg--highlight);
		}

		.select:not(:disabled):focus + & {
			border-color: var(--color--hover);
		}

		&.is-contained {
			border: none;
		}

		&.is-first-item {
			border-top-left-radius: 4px;
			border-top-right-radius: 4px;
		}

		&.is-last-item {
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px;
		}
	}
}

.bar__label {
	display: flex;
	@include space-children-h(20px);

	font-size: 1.6rem;

	.select:focus + .bar.is-contained & {
		color: var(--color--hover);
	}

	@include mq($from: desktop) {
		@include space-children-h(10px);
	}
}

.label__icon {
	width: 1.6rem;

	color: var(--color--text--secondary);
}

.label__text {
	.select:disabled + .bar & {
		cursor: not-allowed;
	}
}

.bar__chevron {
	font-size: 1.4rem;

	color: var(--color--text--secondary);

	.select:focus + .bar.is-contained & {
		color: var(--color--hover);
	}

	@include mq($from: desktop) {
		font-size: 1.2rem;

		.select:not(:focus):not(:disabled):hover + .bar & {
			color: var(--color--hover);
		}
	}
}

</style>
<!--}}}-->
