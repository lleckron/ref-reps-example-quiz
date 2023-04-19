<template>
	<header class="ref-reps-header">
        <nav class="header-nav">
            <div class="header-content">
                <div class="left-nav-content">
                    <img src="../assets/refreps_logo_web.webp" alt="Ref Reps logo" />

                    <div class="explore-content">
                        <div class="explore-div">
                            <svg class="explore-svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="store" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path class="explore-path" fill="currentColor" d="M483.4 224C463.8 224 445.8 217.5 431.3 206.8C426.5 203.3 422.2 199.4 418.3 195C414.4 199.3 410.1 203.2 405.4 206.7C390.9 217.5 372.8 224 353.1 224C333.5 224 315.6 217.6 301.1 206.1C296.3 203.4 291.9 199.4 287.9 195C283.9 199.4 279.5 203.4 274.7 206.1C260.2 217.6 242.3 224 222.7 224C203.2 224 185.2 217.6 170.7 206.1C165.9 203.4 161.5 199.4 157.6 195C153.6 199.4 149.1 203.4 144.3 206.1C129.9 217.6 111.1 223.1 92.41 224C92.39 224 92.38 224 92.36 224C88.3 224 84.21 223.7 80.24 223.2C24.92 215.8-1.255 150.6 28.33 103.8L85.66 13.13C90.76 4.979 99.87 0 109.6 0H466.4C476.1 0 485.2 4.978 490.3 13.13L547.6 103.8C577.3 150.7 551 215.8 495.5 223.2C491.6 223.7 487.6 223.1 483.5 224C483.5 224 483.5 224 483.4 224H483.4zM455.6 48H120.4L68.91 129.5C63.12 138.6 62.57 149.9 66.65 159.6C70.57 168.8 77.67 174.4 86.56 175.6C88.57 175.9 90.54 176 92.36 176C104.2 176 114.6 170.9 121.9 162.8C131 152.8 143.1 147 157.6 147C171.1 147 184.1 152.8 193.2 162.8C200.5 170.9 210.9 176 222.7 176C234.6 176 244.1 170.9 252.3 162.8C261.4 152.8 274.3 147 287.9 147C301.5 147 314.4 152.8 323.5 162.8C330.8 170.9 341.3 176 353.1 176C364.9 176 375.3 170.9 382.6 162.8C391.7 152.8 404.6 147 418.2 147C431.7 147 444.7 152.7 453.8 162.8C461.2 170.9 471.7 176 483.4 176C485.4 176 487.3 175.9 489.3 175.6C498.3 174.4 505.4 168.8 509.3 159.6C513.4 149.1 512.9 138.7 507.1 129.5L455.6 48zM464 336V254.4C470.3 255.5 476.8 256 483.4 256C489 256 494.4 255.6 499.7 254.9L499.7 254.9C503.1 254.4 508 253.6 512 252.6V448C512 483.3 483.3 512 448 512H128C92.66 512 64 483.3 64 448V252.6C67.87 253.6 71.86 254.4 75.97 254.9L76.09 254.9C81.35 255.6 86.83 256 92.36 256C99.06 256 105.6 255.4 112 254.4V336H464zM464 384H112V448C112 456.8 119.2 464 128 464H448C456.8 464 464 456.8 464 448V384z"></path>
                            </svg>
                            <span>Explore</span>
                        </div>
                    </div>
                </div>

                <div class="right-nav-content">
                    <div class="shop-content">
                        <div class="shop-div">
                            <svg class="svg-inline--fa fa-cart-shopping h-6 w-6" aria-hidden="true" focusable="false" data-prefix="far" data-icon="cart-shopping" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path class="shop-path" fill="currentColor" d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48H69.5c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H199.7c-11.5 0-21.4-8.2-23.6-19.5L170.7 288H459.2c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32h-411C111 12.8 91.6 0 69.5 0H24zM131.1 80H520.7L482.4 222.2c-2.8 10.5-12.3 17.8-23.2 17.8H161.6L131.1 80zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"></path>
                            </svg>
                        </div>
                    </div>

                    <button class="edit-button">
                        <p class="edit-p">Edit</p>
                    </button>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>

export default {
	name: 'NavbarHeader'
}
</script>

<style>

.ref-reps-header {
    position: sticky;
    height: 96px;
    width: 100%;
    --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);
    --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);
}

.header-nav {
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}

.header-content {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 1px;
    --tw-border-opacity: 1;
    border-color: rgb(107 114 128 / var(--tw-border-opacity));
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
}

.left-nav-content {
    display: flex;
    align-items: center;
}

.left-nav-content img {
    width: auto;
    height: 3rem;
}

.explore-content {
    display: block;
    margin-left: 2.5rem;
}

.explore-div {
    display: inline-flex;
    position: relative;
    align-items: center;
    --tw-text-opacity: 1;
    color: rgb(45 212 191 / var(--tw-text-opacity));
    font-weight: 600;
    margin-right: 1.25rem;
}

.explore-div:hover {
    --tw-text-opacity: 1;
    color: rgb(17 24 39 / var(--tw-text-opacity));
    cursor: pointer;
}

.explore-svg {
    display: inline-block;
    font-size: inherit;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
    margin-right: 0.25rem;
}

.right-nav-content {
    display: flex;
    position: relative;
    justify-content: flex-end;
    align-items: center;
    margin-left: 2.5rem;
}

.shop-content {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    padding-right: 0.5rem;
    cursor: pointer;
    --tw-text-opacity: 1;
    color: rgb(75 85 99 / var(--tw-text-opacity));
}

.shop-div {
    display: inline-block;
    vertical-align: -0.125em;
    font-size: inherit;
    width: 1.5rem;
    height: 1.5rem;
}

.shop-div:hover {
    --tw-text-opacity: 1;
    color: rgb(45 212 191 / var(--tw-text-opacity));
}

.edit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
    height: 42px;
    border: 1px solid #0e333c;
    background: rgb(255,255,255);
    --tw-text-opacity: 1;
    color: rgb(55 65 81 / var(--tw-text-opacity));
    cursor: pointer;
}

.edit-button:hover {
    background: rgb(0 0 0);
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
}

.edit-p {
    font-size: 1rem;
    font-weight: bold;
}
</style>