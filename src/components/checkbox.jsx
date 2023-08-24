import * as StyledCheckbox from "./styled/checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

export default function Checkbox({
	theme,
	pop,
	defaultValue,
	value,
	onValueChange = () => { }
}, props) {

	return (
		<StyledCheckbox.Root
			theme={theme}
			pop={pop}
			defaultChecked={defaultValue}
			value={value}
			onCheckedChange={(value) => {
				onValueChange(value)
			}}
			{...props}
		>
			<StyledCheckbox.Indicator
				theme={theme}
				pop={pop}
			>
				<CheckIcon style={{
					scale: '150%'
				}} />
			</StyledCheckbox.Indicator>
		</StyledCheckbox.Root>
	)
}