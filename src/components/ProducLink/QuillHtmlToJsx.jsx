import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import PropTypes from "prop-types";
import HtmlToJsx, { attributesToProps } from "html-react-parser";
import Image from "next/image";
// vì taiwwincss dẫ format css của editor nên ta phải import model css "theme snow "
// vào để có đucợ format như khi ta dùng editor
import "quill/dist/quill.snow.css";
import "highlight.js/styles/darcula.css";

// import quillSnowCss from "../../../styles/quill.snow.module.css";
// https://www.npmjs.com/package/quill-delta-to-html
// https://www.npmjs.com/package/html-react-parser

const ObjectIsEmpty = obj => {
	// because Object.keys(new Date()).length === 0;
	// we have to do some additional check

	if (
		obj && // 👈 null and undefined check
		Object.keys(obj).length === 0 &&
		obj.constructor === Object
	)
		return true;
	return false;
};
const QuillHtmlToJsx = props => {
	const { html } = props;

	// if (ObjectIsEmpty(Describe) || !Array.isArray(Describe.ops)) return "";

	// chuyển delta => html
	// const optionsConverDelta = {
	//       classPrefix: "ql",
	//       allowBackgroundClasses: true,
	//       inlineStyles: {
	//             font: {
	//                   serif: "font-family: Georgia, Times New Roman, serif",
	//                   monospace: "font-family: Monaco, Courier New, monospace",
	//             },
	//             size: {
	//                   small: "font-size: 0.75em",
	//                   large: "font-size: 1.5em",
	//                   huge: "font-size: 2.5em",
	//             },
	//             indent: (value, op) => {
	//                   var indentSize = parseInt(value, 10) * 3;
	//                   var side = op.attributes["direction"] === "rtl" ? "right" : "left";
	//                   return "padding-" + side + ":" + indentSize + "em";
	//             },
	//             direction: (value, op) => {
	//                   if (value === "rtl") {
	//                         return "direction:rtl" + (op.attributes["align"] ? "" : "; text-align: inherit");
	//                   } else {
	//                         return "";
	//                   }
	//             },
	//             "span-wrapper": (value, op) => {
	//                   console.log(value, op, "spanw")
	//             },

	//       },
	// };
	// const converter = new QuillDeltaToHtmlConverter(Describe.ops, optionsConverDelta);
	// // converter.
	// const htmlFromDelta = converter.convert();

	// chuyển html ==> jsx
	const optionsConverHtmlToJsx = {
		replace: domNode => {
			// vì ta thích sử dụng Image component của next js
			// nên ta thây thế thẻ images bằng component image
			// if (domNode.children && domNode.name === "p") {
			//       const custom = domNode.children.map((child) => {
			//             if (child.type === "text") {
			//                   return <p></p>
			//             }
			//             if (child.name === 'img') {
			//                   return <div>

			//                   </div>
			//             }
			//       })
			// }
			if (domNode.attribs?.contenteditable) {
				delete domNode.attribs.contenteditable;
			}
			if (domNode.attribs && domNode.name === "img") {
				const propsEl = attributesToProps({
					...domNode.attribs,
					// src: "/_next/image?url=http%3A%2F%2Flocalhost%3A3000%2Fbackend%2Fphone%2Fdien-thoai-iphone-12-pro-max-6-gb-512-gb-6-org.jpg&w=3840&q=100"
				});
				return <img {...propsEl} />;
			}
		},
	};
	const jsx = HtmlToJsx(html, optionsConverHtmlToJsx);

	return (
		<div className={"ql-snow"}>
			<div className={"ql-editor"}>{jsx}</div>
		</div>
	);
};

export default QuillHtmlToJsx;
