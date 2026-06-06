$downloads = @(
  @{ url = "https://archive.org/download/vintagesense_com_indian_hindi_instrumentals/103_pal_pal_dil_ke_paas_hindi_indian_film_instrumental_vintagesense_com.mp3"; dest = "public/samples/pal_pal_dil_ke_paas.mp3" },
  @{ url = "https://archive.org/download/vintagesense_com_indian_hindi_instrumentals/041_ek_pyar_ka_nagma_hai_hindi_indian_film_instrumental_vintagesense_com.mp3"; dest = "public/samples/ek_pyar_ka_nagma_hai.mp3" },
  @{ url = "https://archive.org/download/vintagesense_com_indian_hindi_instrumentals/060_janam_janam_ka_saath_ha_hindi_indian_film_instrumental_vintagesense_com.mp3"; dest = "public/samples/janam_janam_ka_saath_hai.mp3" },
  @{ url = "https://archive.org/download/vintagesense_com_indian_hindi_instrumentals/044_gaata_rahe_mera_dil_hindi_indian_film_instrumental_vintagesense_com.mp3"; dest = "public/samples/gaata_rahe_mera_dil.mp3" },
  @{ url = "https://archive.org/download/vintagesense_com_indian_hindi_instrumentals/086_main_shayer_to_nahin_hindi_indian_film_instrumental_vintagesense_com.mp3"; dest = "public/samples/main_shayar_to_nahin.mp3" },
  @{ url = "https://archive.org/download/vintagesense_com_indian_hindi_instrumentals/003_aaja_sanam_madhur_chand_hindi_indian_film_instrumental_vintagesense_com.mp3"; dest = "public/samples/aaja_sanam_madhur_chandni.mp3" }
)

foreach ($item in $downloads) {
  Write-Host "Downloading $($item.url) to $($item.dest)..."
  Invoke-WebRequest -Uri $item.url -OutFile $item.dest
}
Write-Host "All downloads completed!"
