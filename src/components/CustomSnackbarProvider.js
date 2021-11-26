import { SnackbarProvider } from "notistack";
import { CheckCircleFill } from "react-bootstrap-icons";
function CustomSnackbarProvider(props) {
	return (
		<SnackbarProvider
			classes={{
				variantSuccess: "bg-green-600 mb-2",
				variantError: "mb-2",
				variantWarning: "mb-2",
				variantInfo: "mb-2",
			}}
			hideIconVariant={false}
			maxSnack={3}
			autoHideDuration={5000}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center",
			}}>
			{props.children}
		</SnackbarProvider>
	);
}

export default CustomSnackbarProvider;
