export interface ProductItemInterface {
	BrandImage?: string[];
	BrandName?: string[];
	CountEvaluate?: number;
	DisplayImage?: string;
	Id_Product?: string;
	Path?: string;
	Price?: number;
	PriceSale?: number;
	ProductName?: string;
	ProductType?: string;
	RemainingAmount?: number;
	Star?: number;
}
export interface PropductItemSmallItemInterface {
	ProductName?: string;
	Path?: string;
	Price?: number;
	PriceSale?: number;
	DisplayImage?: string;
}
//nave link
export interface NavLinkInterface {
	title?: string;
	href?: string;
	items?: {
		title?: string;
		href?: string;
	}[];
}
