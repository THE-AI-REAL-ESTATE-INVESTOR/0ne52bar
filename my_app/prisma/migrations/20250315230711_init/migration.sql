-- CreateTable
CREATE TABLE "TestTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "colorHex" TEXT NOT NULL,

    CONSTRAINT "TestTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "tags" TEXT[],
    "categoryId" TEXT NOT NULL,
    "testUserId" TEXT NOT NULL,
    "testCategoryId" TEXT NOT NULL,

    CONSTRAINT "TestPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestComment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "testPostId" TEXT NOT NULL,
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TestProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestOrder" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "testOrderId" TEXT NOT NULL,
    "testProductId" TEXT NOT NULL,

    CONSTRAINT "TestOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testProductId" TEXT NOT NULL,
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAddress" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "addressType" TEXT NOT NULL,
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL,
    "details" TEXT,
    "testOrderId" TEXT NOT NULL,

    CONSTRAINT "TestPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSubscription" (
    "id" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "billingPeriod" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestNotification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAlert" (
    "id" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged" BOOLEAN NOT NULL,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedById" TEXT,
    "testUserId" TEXT NOT NULL,

    CONSTRAINT "TestAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "picture" TEXT,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookPage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "category" TEXT,
    "tasks" TEXT[],

    CONSTRAINT "FacebookPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiResponse" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "data" JSONB,
    "error" TEXT,

    CONSTRAINT "ApiResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookSDK" (
    "id" TEXT NOT NULL,
    "init" TEXT NOT NULL,
    "getLoginStatus" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "logout" TEXT NOT NULL,
    "api" TEXT NOT NULL,

    CONSTRAINT "FacebookSDK_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Window" (
    "id" TEXT NOT NULL,
    "fbAsyncInit" TEXT,
    "facebookSDKId" TEXT NOT NULL,

    CONSTRAINT "Window_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TapPassFormData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "agreeToTerms" BOOLEAN NOT NULL,

    CONSTRAINT "TapPassFormData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TapPassMember" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "memberSince" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "visits" INTEGER NOT NULL,
    "lastVisit" TEXT,

    CONSTRAINT "TapPassMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "implemented" BOOLEAN NOT NULL,

    CONSTRAINT "AdminCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "facebookEventUrl" TEXT,
    "eventTagId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "businessSettingsId" TEXT,
    "businessInfoId" TEXT,

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessSettings" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "aboutText" TEXT NOT NULL,
    "socialMedia" TEXT NOT NULL,

    CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlugParams" (
    "id" TEXT NOT NULL,
    "slug" TEXT[],

    CONSTRAINT "SlugParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParams" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EventParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "agreeToTerms" BOOLEAN NOT NULL,

    CONSTRAINT "FormData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginData" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "LoginData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisterResponse" (
    "id" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "memberId" TEXT NOT NULL,
    "error" TEXT,

    CONSTRAINT "RegisterResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailResponse" (
    "id" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,

    CONSTRAINT "EmailResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateMemberParams" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "CreateMemberParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindMemberParams" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "memberId" TEXT,

    CONSTRAINT "FindMemberParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT,
    "place" TEXT,
    "cover" TEXT,
    "event_times" JSONB,
    "facebookEventsResponseId" TEXT,

    CONSTRAINT "FacebookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookEventsResponse" (
    "id" TEXT NOT NULL,
    "error" TEXT,

    CONSTRAINT "FacebookEventsResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAmenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "businessInfoId" TEXT NOT NULL,

    CONSTRAINT "BusinessAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "amenities" TEXT[],

    CONSTRAINT "BusinessInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TestUser_email_key" ON "TestUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_email_key" ON "UserData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TapPassFormData_email_key" ON "TapPassFormData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSettings_email_key" ON "BusinessSettings"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FormData_email_key" ON "FormData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoginData_email_key" ON "LoginData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FindMemberParams_email_key" ON "FindMemberParams"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_email_key" ON "EventAttendee"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "TestPost" ADD CONSTRAINT "TestPost_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPost" ADD CONSTRAINT "TestPost_testCategoryId_fkey" FOREIGN KEY ("testCategoryId") REFERENCES "TestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestComment" ADD CONSTRAINT "TestComment_testPostId_fkey" FOREIGN KEY ("testPostId") REFERENCES "TestPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestComment" ADD CONSTRAINT "TestComment_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestOrder" ADD CONSTRAINT "TestOrder_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestOrderItem" ADD CONSTRAINT "TestOrderItem_testOrderId_fkey" FOREIGN KEY ("testOrderId") REFERENCES "TestOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestOrderItem" ADD CONSTRAINT "TestOrderItem_testProductId_fkey" FOREIGN KEY ("testProductId") REFERENCES "TestProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestReview" ADD CONSTRAINT "TestReview_testProductId_fkey" FOREIGN KEY ("testProductId") REFERENCES "TestProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestReview" ADD CONSTRAINT "TestReview_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAddress" ADD CONSTRAINT "TestAddress_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPayment" ADD CONSTRAINT "TestPayment_testOrderId_fkey" FOREIGN KEY ("testOrderId") REFERENCES "TestOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSubscription" ADD CONSTRAINT "TestSubscription_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestNotification" ADD CONSTRAINT "TestNotification_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAlert" ADD CONSTRAINT "TestAlert_testUserId_fkey" FOREIGN KEY ("testUserId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Window" ADD CONSTRAINT "Window_facebookSDKId_fkey" FOREIGN KEY ("facebookSDKId") REFERENCES "FacebookSDK"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTagId_fkey" FOREIGN KEY ("eventTagId") REFERENCES "EventTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_businessSettingsId_fkey" FOREIGN KEY ("businessSettingsId") REFERENCES "BusinessSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_businessInfoId_fkey" FOREIGN KEY ("businessInfoId") REFERENCES "BusinessInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_facebookEventsResponseId_fkey" FOREIGN KEY ("facebookEventsResponseId") REFERENCES "FacebookEventsResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessAmenity" ADD CONSTRAINT "BusinessAmenity_businessInfoId_fkey" FOREIGN KEY ("businessInfoId") REFERENCES "BusinessInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
