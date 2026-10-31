interface CustomBottomSheetProps {
  index?: number;
  onClose?: () => void;
  renderView: () => any;
  label?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  paddingHorizontal?: number;
  onPress?: () => void;
  RenderFooter?: () => any;
  forComments?: boolean;
  useBottomSheetCustomFooter?: boolean;
  containerStyle?: object;
}

type StackHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  style?: object;
  titleStyle?: object;
  subtitle?: string;
  onTextPress?: () => void;
};

type StackHeadersProps = {
  title?: string;
  onBackPress?: () => void;
  style?: object;
  titleStyle?: object;
};

interface ICalenderProps {
  initialDate?: string;
}

interface ICheckBoxProp {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  renderContent: () => any;
}

interface RadioOption {
  label: string;
  value: string | number;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  containerStyle?: object;
  labelStyle?: object;
  label?: string;
}

type DataEmptyProps = {
  uri: any;
  title: string;
};
