export enum userGender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum userStatus {
    NOTACTIVE = 'Not Active',
    ACTIVE = 'Active',
    REMOVED = 'Removed',
}

export enum userRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export enum productStatus {
    OUTSTOCK = 'Out stock',
    STOCK = 'Stock',
    INACTIVE = 'Inactive',
}

export enum categoryStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export enum orderPayment {
    CASH = 'Cash',
    MOMO = 'MoMo',
    VNPAY = 'VNPay',
}

export enum orderStatus {
    SHOPPING = 'Shopping',
    ORDERED = 'Ordered',
    COMPLETED = 'Completed',
    REMOVED = 'Removed',
}

export enum orderShipment {
    GHN = 'Giao hang nhanh',
    VIETTELPOST = 'ViettelPost',
}

export enum couponStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export enum flashSaleProductStatus {
    ACTIVE = 'Active',
    ONSALE = 'OnSale',
    OUTSTOCK = 'OutStock',
    INACTIVE = 'Inactive',
}
